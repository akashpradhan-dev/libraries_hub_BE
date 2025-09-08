import User from '@/model/User';
import { errorResponse, successResponse } from '@/utils/response';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/utils/generateToken';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 'Invalid email or password----', 401);
    }

    const isPasswordValid = await bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, likes, ...userWithoutPassword } = user.toObject();

    const token = generateToken({ _id: user._id.toString(), role: user.role });

    const payload = {
      ...userWithoutPassword,
      token: token,
    };

    return successResponse(res, payload, 'Login successful', 200);
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

    return successResponse(
      res,
      { user: userWithoutPassword, token },
      'User registered successfully',
      201
    );
  } catch (error) {
    return errorResponse(res, 'Failed to register user', 500, error);
  }
};
