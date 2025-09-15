import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '@/model/User';
import { UserPayload } from '@/types/types';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // cookie-parser puts cookies in req.cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;

    const user = await User.findById(decoded._id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    } as UserPayload;

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token', error });
  }
};
