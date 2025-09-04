
import { ddbClient } from '@/lib/aws-config';
import { PutItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const REMINDER_TABLE_NAME = 'warranty-reminder-settings';

const getUserId = (req: any): string | null => {
  return 'user123'; 
};

const sendError = (res: any, statusCode: number, message: string) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ message }));
};

const sendSuccess = (res: any, statusCode: number, data: any) => {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
};

export default async function handler(req: any, res: any) {
  try {
    if (typeof req.body === 'string' && req.body) {
      try {
        req.body = JSON.parse(req.body);
      } catch (e) {
        return sendError(res, 400, 'Invalid JSON in request body');
      }
    }

    const userId = getUserId(req);

    if (!userId) {
      return sendError(res, 401, 'Unauthorized');
    }

    if (req.method === 'POST') {
      const settingsData = req.body;

      if (!settingsData) {
        return sendError(res, 400, 'Missing settings data');
      }

      const { email, phoneNumber, reminderDays } = settingsData;

      const params = {
        TableName: REMINDER_TABLE_NAME,
        Item: marshall({
          userId,
          email,
          phoneNumber,
          reminderDays,
        }),
      };
      await ddbClient.send(new PutItemCommand(params));
      sendSuccess(res, 200, { message: 'Settings saved successfully' });

    } else if (req.method === 'GET') {
      const params = {
        TableName: REMINDER_TABLE_NAME,
        Key: marshall({ userId }),
      };
      const { Item } = await ddbClient.send(new GetItemCommand(params));

      if (Item) {
        sendSuccess(res, 200, unmarshall(Item));
      } else {
        sendError(res, 404, 'Settings not found');
      }
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      sendError(res, 405, `Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    console.error('[API_ERROR] An unexpected error occurred in reminder-settings:', error);
    sendError(res, 500, `An internal server error occurred: ${error.message}`);
  }
}
