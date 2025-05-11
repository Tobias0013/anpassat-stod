import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from './jwtHandler';

/**
 * Middleware function to handle JWT authentication.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next function to call in the middleware chain.
 */
export const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.includes(' ') ? authHeader.split(' ')[1] : authHeader;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = verifyJwt(token);
    req.body.userId = decoded.id;
    req.body.username = decoded.username;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Failed to authenticate token' });
  }
};