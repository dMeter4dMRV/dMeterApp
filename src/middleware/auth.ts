import { Request, Response, NextFunction } from 'express';
import { verifySignature } from '../utils/crypto';
import { AppError } from './errorHandler';

export interface AuthenticatedRequest extends Request {
  user?: {
    address: string;
    publicKey: string;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const signature = req.headers['x-signature'] as string;
    const timestamp = req.headers['x-timestamp'] as string;
    const publicKey = req.headers['x-public-key'] as string;

    if (!signature || !timestamp || !publicKey) {
      throw new AppError(401, 'Missing authentication headers');
    }

    // Verify timestamp is within acceptable range (e.g., 5 minutes)
    const timestampNum = parseInt(timestamp);
    const now = Date.now();
    if (Math.abs(now - timestampNum) > 5 * 60 * 1000) {
      throw new AppError(401, 'Request timestamp expired');
    }

    // Verify signature
    const message = `${req.method}${req.path}${timestamp}`;
    const isValid = verifySignature(message, signature, publicKey);
    
    if (!isValid) {
      throw new AppError(401, 'Invalid signature');
    }

    // Add user info to request
    req.user = {
      address: req.headers['x-address'] as string,
      publicKey
    };

    next();
  } catch (error) {
    next(error);
  }
}; 