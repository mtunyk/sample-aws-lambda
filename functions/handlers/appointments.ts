import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context, Handler } from 'aws-lambda'
import { google } from 'googleapis'
import { headers } from '@/constants'
import serviceAccount from '../../serviceAccount.json'

// Define the scopes for the Google APIs we are accessing.
const scopes = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/admin.directory.resource.calendar'
]

// Initialize the Google API SDK with the service account.
const auth = new google.auth.JWT(
  serviceAccount.client_email,
  undefined,
  serviceAccount.private_key,
  scopes,
  'admin@sample.tld',
  'xxxxx'
)

const calendar = google.calendar({ version: 'v3', auth })
const calendarId = 'c_xxxxx@group.calendar.google.com'

export const postAppointmentsHandler: Handler = async (event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> => {
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

  const { summary, email, description, startDateTime, endDateTime, timeZone } = JSON.parse(event.body ?? '{}')

  // Check if summary, startDateTime, and endDateTime are provided
  if (!summary || !email || !startDateTime || !endDateTime || !timeZone) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        message: 'Required parameter(s) missing: summary, email, startDateTime, endDateTime, timeZone',
      }),
    }
  }

  // Create event object
  const calendarEvent = {
    summary,
    description,
    start: {
      dateTime: startDateTime,
      timeZone: timeZone,
    },
    end: {
      dateTime: endDateTime,
      timeZone: timeZone,
    },
    attendees: [{ email }],
  }

  try {
    // Insert event into the calendar
    const calendarEventData = {
      auth: auth,
      calendarId,
      resource: calendarEvent,
      sendNotifications: true,
    }
    const response = await calendar.events.insert(calendarEventData)

    console.debug(response)

    return {
      statusCode: response.status ?? 200,
      headers,
      body: JSON.stringify(response.data),
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Unexpected error occurred while scheduling the event',
      }),
    }
  }
}
