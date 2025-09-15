import { Request } from 'express';

export interface UserPayload {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}
