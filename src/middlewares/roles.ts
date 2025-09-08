import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // @ts-expect-error - user will send the payload
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Admins only',
    });
  }
  next();
};
