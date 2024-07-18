import { SendEmailCommand } from '@aws-sdk/client-ses'
import { validate } from 'deep-email-validator'
import { headers } from '@/constants'
import sesClient from '@/aws-ses'

import type { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'

export const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> => {
  const httpMethod = event.requestContext.http.method

  // Validate email
  if (httpMethod === 'GET') {
    const email: string = event.queryStringParameters?.email as string

    try {
      const emailValid = await validate({
        email,
        sender: email,
        validateRegex: true,
        validateMx: true,
        validateTypo: true,
        validateDisposable: true,
        validateSMTP: false,
      })

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ valid: emailValid.valid }),
      }
    } catch (err) {
      console.error(err)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          message: `Unexpected Error: failed to validate email: ${err}`,
        }),
      }
    }
  }

  // Send email
  if (httpMethod === 'POST') {
    const rawPayload: string = event.body as string

    if (!rawPayload) {
      return {
        statusCode: 400,
        body: 'Cannot process event: no request body',
      }
    }

    const payload = JSON.parse(rawPayload)
    const { subject, message, firstName, lastName, phone, email, address } = payload
    const to = 'info@sample.tld'

    // Check if any field is undefined or empty
    if (!subject || !message || !firstName || !lastName || !phone || !email || !address) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          message: 'Missed required parameter(s): subject, message, firstName, lastName, phone, email, address',
        }),
      }
    }

    try {
      // Define email parameters
      const emailParams = {
        Source: 'admin@sample.tld',
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Body: {
            Text: {
              Charset: 'UTF-8',
              Data: `${message}\n\n=====================\n
               Sent by: ${firstName} ${lastName}\n
               Contact e-mail: ${email}\n
               Contact phone: ${phone}\n
               Address: ${address}`,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: subject,
          },
        },
      }

      // Send the email
      const sendEmailCommand = new SendEmailCommand(emailParams)
      const { MessageId: messageId } = await sesClient.send(sendEmailCommand)

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ messageId }),
      }
    } catch (err) {
      console.error(err)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          message: `Unexpected Error: failed to send message: ${err}`,
        }),
      }
    }
  }

  // Return error for unsupported method
  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({
      message: `Only accept GET or POST method, you tried: ${httpMethod}`,
    }),
  }
}
