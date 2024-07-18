import { SESClient } from '@aws-sdk/client-ses'
import { AWS_REGION } from '@/constants'

import type { SESClientConfig } from '@aws-sdk/client-ses'

// Create an instance of the SES client
const sesClient = new SESClient({ region: AWS_REGION } satisfies SESClientConfig)

export default sesClient
