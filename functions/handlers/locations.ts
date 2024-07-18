import { headers } from '@/constants'

import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context, Handler } from 'aws-lambda'
import type { Location } from '@/types/Location'

export const findLocationsHandler: Handler = async (event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> => {
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

  const limit: string = event.queryStringParameters?.limit as string ?? 5
  const page: string = event.queryStringParameters?.page as string ?? 0
  const query: string = event.queryStringParameters?.q ?? ''

  const response = await fetch(`${API_HOST}/custom-components/address-autocomplete?input=${query}&limit=${limit}&page=${page}&apiKey=${apiKey}`)

  try {
    const data = await response.json()

    if (!response.ok) {
      console.debug(`${response.status}: ${data.message} - ${JSON.stringify(data.errors)}`)
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          message: 'Unsuccessful response',
        }),
      }
    }

    const locations: Location[] = <Location[]>data

    return {
      statusCode: response.status,
      headers,
      body: JSON.stringify(locations),
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
