// middlewares/auth.ts
import { UserPayload } from '@/controller/Auth';
import User from '@/model/User';
import { errorResponse } from '@/utils/response';
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: UserPayload;
}

interface CustomJwtPayload extends JwtPayload {
  id: string;
  role: string;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;

    const user = await User.findById(decoded?.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    return errorResponse(res, 'Invalid or expired token', 401, err);
  }
};
