import { NextFunction, Request, Response } from 'express';
import ErrorHandler from '../utils/utility-class.js';
import { ControllerType } from '../types/types.js';

const errorMiddleware = (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
  err.message ||= 'Internal server error';
  err.statusCode ||= 500;
  err.details ||= undefined;

  if (err.name === 'CastError') err.message = 'Invalid Id';

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    details: err.details,
  });
};

const TryCatch = (func: ControllerType) => (req: Request, res: Response, next: NextFunction) => {
  return Promise.resolve(func(req, res, next)).catch(next);
};

export { errorMiddleware, TryCatch };
