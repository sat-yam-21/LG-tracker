
import { ddbClient } from '@/lib/aws-config';
import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const PRODUCTS_TABLE_NAME = 'warranty-products';

// Centralized error response helper
const sendError = (res: any, statusCode: number, message: string) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ message }));
};

// Centralized success response helper
const sendSuccess = (res: any, statusCode: number, data: any) => {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
};

export default async function handler(req: any, res: any) {
    try {
        if (req.method !== 'POST') {
            res.setHeader('Allow', ['POST']);
            return sendError(res, 405, `Method ${req.method} Not Allowed`);
        }

        if (typeof req.body === 'string' && req.body) {
            try {
                req.body = JSON.parse(req.body);
            } catch (e) {
                return sendError(res, 400, 'Invalid JSON in request body');
            }
        }

        const productData = req.body;

        if (!productData) {
            return sendError(res, 400, 'Missing product data');
        }

        const { model, serialNumber, purchaseDate, warrantyPeriod, email } = productData;

        if (!model || !serialNumber || !purchaseDate || !warrantyPeriod || !email) {
            return sendError(res, 400, 'Missing required product fields');
        }

        const userId = 'user123'; // In a real app, get this from auth
        const productId = uuidv4();

        const params = {
            TableName: PRODUCTS_TABLE_NAME,
            Item: marshall({
                userId,
                productId,
                model,
                serialNumber,
                purchaseDate,
                warrantyPeriod,
                email,
                registeredAt: new Date().toISOString(),
            }),
        };
        
        await ddbClient.send(new PutItemCommand(params));
        sendSuccess(res, 201, { message: 'Product registered successfully', productId });

    } catch (error: any) {
        console.error('[API_ERROR] An unexpected error occurred in register-product:', error);
        // Send a generic error response to avoid leaking implementation details
        sendError(res, 500, `An internal server error occurred: ${error.message}`);
    }
}
