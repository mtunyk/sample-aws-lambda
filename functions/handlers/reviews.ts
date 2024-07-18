import { headers } from '@/constants'

import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context, Handler } from 'aws-lambda'
import type { Review } from '@/types/Review'

export const getGoogleReviewsHandler: Handler = async (event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> => {
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

  const placeId: string = event.queryStringParameters?.placeId as string

  if (!placeId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        message: 'Required parameter(s) missing: placeId',
      }),
    }
  }

  const response = await fetch(`${GOOGLE_API_HOST}/place/details/json?place_id=${placeId}&fields=review&key=${apiKey}`)

  try {
    const data = await response.json()
    console.debug(data)

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

    if (data.status !== 'OK') {
      console.debug(`${data.status}: ${JSON.stringify(data)}`)
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          message: 'Unsuccessful response: Error fetching Google reviews',
        }),
      }
    }

    const reviews: Review[] = data.result.reviews

    return {
      statusCode: response.status,
      headers,
      body: JSON.stringify(reviews),
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
