import { Response } from 'express';

export const successResponse = (res: Response, data = {}, message = 'Success', status = 200) => {
  return res.status(status).json({
    status: 'success',
    message,
    data,
  });
};

export const errorResponse = (
  res: Response,
  message = 'Error',
  status = 500,
  errors: unknown = null
) => {
  return res.status(status).json({
    status: 'error',
    message,
    errors,
  });
};
