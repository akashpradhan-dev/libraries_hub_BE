import { UserPayload } from '@/model/User';
import jwt from 'jsonwebtoken';

export const generateToken = (user: Pick<UserPayload, '_id' | 'role'>) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  });
};
