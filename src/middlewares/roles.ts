import { AuthRequest } from '@/types/types';
import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  const role = authReq.user?.role;

  if (role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Admins only',
    });
  }
  next();
};
