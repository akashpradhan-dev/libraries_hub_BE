// middlewares/validate.js
import { NextFunction, Request, Response } from 'express';
import { FieldValidationError, validationResult } from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: (err as FieldValidationError).path,
        message: err.msg,
      })),
    });
  }

  next();
};
