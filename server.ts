
import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { ddbClient } from './src/lib/aws-config'; // Adjusted path
import {
  PutItemCommand,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const app = express();
const port = 3001; // We'll run the backend on a different port

app.use(cors());
app.use(json());

const REMINDER_TABLE_NAME = 'warranty-reminder-settings';
const USER_PRODUCTS_TABLE_NAME = 'user-products';

// A simple function to get a user ID. Replace with real auth logic.
const getUserId = () => 'user123';

// API Endpoint to get reminder settings
app.get('/api/reminder-settings', async (req, res) => {
  const userId = getUserId();
  try {
    const params = {
      TableName: REMINDER_TABLE_NAME,
      Key: marshall({ userId }),
    };
    const { Item } = await ddbClient.send(new GetItemCommand(params));

    if (Item) {
      res.status(200).json(unmarshall(Item));
    } else {
      // It's okay if settings are not found, we can send a default or empty object.
      res.status(200).json({});
    }
  } catch (error) {
    console.error('Error getting settings from DynamoDB:', error);
    res.status(500).json({ message: 'Error getting settings' });
  }
});

// API Endpoint to save reminder settings
app.post('/api/reminder-settings', async (req, res) => {
  const userId = getUserId();
  const settingsData = req.body;

  if (!settingsData) {
    return res.status(400).json({ message: 'Missing settings data' });
  }

  const { email, phoneNumber, reminderDays } = settingsData;

  try {
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
    res.status(200).json({ message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Error saving settings to DynamoDB:', error);
    res.status(500).json({ message: 'Error saving settings' });
  }
});

// API Endpoint to register a product
app.post('/api/register-product', async (req, res) => {
  const userId = getUserId();
  const productData = req.body;
  
  const {
      productName,
      category,
      model,
      purchaseDate,
      warrantyPeriod,
      serialNumber,
      email,
    } = productData;

    if (!productName || !category || !purchaseDate || !warrantyPeriod || !email) {
      return res.status(400).json({ message: 'Missing required product fields' });
    }

  try {
    const params = {
      TableName: USER_PRODUCTS_TABLE_NAME,
      Item: marshall({
        userId,
        productId: `${category}-${serialNumber || model || Date.now()}`,
        productName,
        category,
        model,
        purchaseDate,
        warrantyPeriod,
        serialNumber,
        userEmail: email,
        createdAt: new Date().toISOString(),
      }),
    };
    await ddbClient.send(new PutItemCommand(params));
    res.status(201).json({ message: 'Product registered successfully' });
  } catch (error) {
    console.error('Error saving product to DynamoDB:', error);
    res.status(500).json({ message: 'Error saving product' });
  }
});


app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
