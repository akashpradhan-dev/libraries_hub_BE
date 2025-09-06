import { UserPayload } from '@/controller/Auth';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: UserPayload;
}

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Admins only',
    });
  }
  next();
};
