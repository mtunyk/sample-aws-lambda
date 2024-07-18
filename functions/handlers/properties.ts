import { headers } from '@/constants'

import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context, Handler } from 'aws-lambda'
import type { Property } from '@/types/Property'

export const getPropertyHandler: Handler = async (event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> => {
  const httpMethod = event.requestContext.http.method

  if (httpMethod !== 'GET') {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        message: `Only accept GET method, you tried: ${httpMethod}`,
      }),
    }
  }

  // const email: string = event.pathParameters?.email as string
  const address: string = event.queryStringParameters?.address as string

  if (!address) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        message: 'Required parameter(s) missing: address',
      }),
    }
  }

  const response = await fetch(`${NJPR_API_HOST}/property/resolve?address=${address}&apiKey=${apiKey}`)

  try {
    const data = await response.json()

    if (!response.ok) {
      console.debug(`${response.status}: ${data.message}`)
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          message: 'Unsuccessful response',
        }),
      }
    }

    const { id, countyData } = data.result
    const property: Property = {
      id,
      owners: countyData.Owners_Name,
      mailingAddress: countyData.Owners_Mailing_Address,
      cityStateZip: countyData.City_State_Zip,
      salePrice: countyData.Sale_Price,
      saleDate: countyData.Sale_Date,
      squareFootage: countyData.Sq_Ft,
      absentee: countyData.Absentee,
      corporateOwned: countyData.Corporate_Owned,
    }

    return {
      statusCode: response.status,
      headers,
      body: JSON.stringify(property),
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Unexpected Error',
      }),
    }
  }
}
