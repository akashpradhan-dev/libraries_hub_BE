import { UserPayload } from '@/types/types';
import jwt from 'jsonwebtoken';

export const generateToken = (user: Pick<UserPayload, '_id' | 'role'>) => {
  return jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  });
};
