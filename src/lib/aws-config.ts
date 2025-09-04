import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { SESClient } from '@aws-sdk/client-ses';
import { SNSClient } from '@aws-sdk/client-sns';

// The region should be sourced from an environment variable for flexibility
const REGION = process.env.AWS_REGION || 'ap-south-1';

// By not providing credentials here, the AWS SDK will automatically look for them
// in the environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY).
// This is the standard and secure way to configure services in hosted environments.

const ddbClient = new DynamoDBClient({ region: REGION });
const sesClient = new SESClient({ region: REGION });
const snsClient = new SNSClient({ region: REGION });

export { ddbClient, sesClient, snsClient };
