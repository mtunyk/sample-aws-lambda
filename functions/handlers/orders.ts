import { SendMessageCommand } from '@aws-sdk/client-sqs'
import { headers } from '@/constants'
import stripe from '@/stripe'
import sqsClient, { QUEUE_URL } from '@/aws-sqs'

import type { SendMessageRequest } from '@aws-sdk/client-sqs'
import type { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'

// Getting Square Option
const getAppraisalSquareOption = (squareFootage: number): string => (
  squareFootage < 1500
    ? 'minPrice'
    : squareFootage <= 2500
      ? 'defaultPrice'
      : 'maxPrice'
)

export const postOrdersHandler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> => {
  const httpMethod = event.requestContext.http.method

  if (httpMethod !== 'POST') {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        message: `Only accept POST method, you tried: ${httpMethod}`,
      }),
    }
  }

  const rawPayload: string = event.body as string

  if (!rawPayload) {
    return {
      statusCode: 400,
      body: 'Cannot process event: no request body',
    }
  }

  const payload = JSON.parse(rawPayload)

  try {
    const priceSlug = getAppraisalSquareOption(payload.squareFootage)
    const priceLookupKeys: string[] = payload.additionalServicesIds.map((productSlug: string) =>
      productSlug === 'certified-flood-determinations' // this service has only one price
        ? `${productSlug}-defaultPrice`
        : `${productSlug}-${priceSlug}`
    )

    if (payload.isAppraisalServiceSelected) {
      priceLookupKeys.push(`appraisals-${priceSlug}`)
    }

    const { data: productsPrices } = await stripe.prices.list({
      active: true,
      type: 'one_time',
      lookup_keys: priceLookupKeys,
      expand: ['data.product'],
    })

    // Check if customer already exists
    const { data: customers } = await stripe.customers.list({
      email: payload.email,
    })

    let customer

    if (customers.length > 0) {
      customer = customers[0]
    } else {
      // Create a Customer
      customer = await stripe.customers.create({
        email: payload.email,
        name: payload.name,
        phone: payload.phone,
      })
    }

    // Create a draft Invoice
    const invoice = await stripe.invoices.create({
      auto_advance: false, // this will create a draft invoice
      collection_method: 'send_invoice',
      days_until_due: 30,
      customer: customer.id,
      metadata: {
        ...payload,
        appraisalInfo: JSON.stringify(payload.appraisalInfo),
        additionalServicesIds: JSON.stringify(payload.additionalServicesIds),
        propertyData: JSON.stringify(payload.propertyData),
      },
    })

    // Create an InvoiceItem for each service
    for (const priceProduct of productsPrices) {
      await stripe.invoiceItems.create({
        invoice: invoice.id,
        customer: customer.id,
        price: priceProduct.id,
      })
    }

    const params: SendMessageRequest = {
      QueueUrl: QUEUE_URL,
      MessageBody: JSON.stringify(invoice),
      // DelaySeconds: Number('int'),
      // MessageDeduplicationId: 'STRING_VALUE',
      // MessageGroupId: 'STRING_VALUE',
    }

    const command = new SendMessageCommand(params)
    await sqsClient.send(command) // TODO: handle the response error (delete draft invoice)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        invoiceId: invoice.id,
      }),
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: `Unexpected Error: failed to create invoice: ${err}`,
      }),
    }
  }
}
