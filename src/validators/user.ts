import { body } from 'express-validator';

export const loginValidator = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('password is required'),
];

export const registerValidator = [
  body('email').isEmail().withMessage('invalid email format'),
  body('name').notEmpty().withMessage('Name is required'),
  body('password').notEmpty().withMessage('password is required'),
];
