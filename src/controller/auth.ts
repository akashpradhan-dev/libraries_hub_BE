import User from '@/model/User';
import { errorResponse, successResponse } from '@/utils/response';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/utils/generateToken';
import { UserPayload } from '@/types/types';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 'Invalid email or password----', 401);
    }

    if (user.password) {
      const isPasswordValid = await bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return errorResponse(res, 'Invalid email or password', 401);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, likes, ...userWithoutPassword } = user.toObject();

    const token = generateToken({ _id: user._id.toString(), role: user.role });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return successResponse(res, userWithoutPassword, 'Login successful', 200);
  } catch (error) {
    return errorResponse(res, 'Failed to login', 500, error);
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { password, name, email } = req.body;
    const existingUser = await User.findOne({
      email,
    });
    if (existingUser) {
      return errorResponse(res, 'User already exists', 409);
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new User({
      password: hashedPassword,
      name,
      email,
      role: 'user',
    });

    const savedUser = await newUser.save();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, likes, ...userWithoutPassword } = savedUser.toObject();

    const token = generateToken({ _id: savedUser._id.toString(), role: savedUser.role });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return successResponse(res, userWithoutPassword, 'User registered successfully', 201);
  } catch (error) {
    return errorResponse(res, 'Failed to register user', 500, error);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    return errorResponse(res, 'Failed to login', 500, error);
  }
};

export const googleAuth = async (req: Request, res: Response) => {
  const user = req.user as UserPayload;

  if (!user) {
    return res.redirect('/login');
  }

  const token = generateToken({ _id: user._id, role: user.role });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie('role', 'user', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const frontendUrl =
    process.env.FRONTEND_AUTH_SUCCESS_REDIRECT_URL || 'http://localhost:3000/oauth-success';

  res.redirect(frontendUrl);
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserPayload;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    return successResponse(res, user, 'User registered successfully', 201);
  } catch (error) {
    return errorResponse(res, 'Failed to register user', 500, error);
  }
};
