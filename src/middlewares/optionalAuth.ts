import { UserPayload } from '@/types/types';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const optionalAuth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
      req.user = {
        _id: decoded._id,
        role: decoded.role,
      } as UserPayload;
    }
  } catch (err) {
    // invalid token → ignore, user stays undefined
    console.log(err);
  }
  next();
};
