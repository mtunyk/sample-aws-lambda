import { DeleteMessageCommand, ReceiveMessageCommand, SQSClient } from '@aws-sdk/client-sqs'

export const QUEUE_URL = process.env.QUEUE_URL!

// Create an instance of the SQS client
const sqsClient = new SQSClient()

async function receiveMessages(cb) {
  try {
    const receiveParams = {
      QueueUrl: QUEUE_URL,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20, // long polling
    }

    const data = await sqsClient.send(new ReceiveMessageCommand(receiveParams))

    if (data.Messages) {
      for (const message of data.Messages) {
        console.log('Received message:', message.Body)

        // Process the message
        await cb()

        // After processing, delete the message from the queue
        const deleteParams = {
          QueueUrl: QUEUE_URL,
          ReceiptHandle: message.ReceiptHandle!,
        }
        await sqsClient.send(new DeleteMessageCommand(deleteParams))
        console.log('Deleted message:', message.MessageId)
      }
    } else {
      console.log('No messages received')
    }
  } catch (error) {
    console.error('Error receiving or processing messages:', error)
  }
}

export default sqsClient
