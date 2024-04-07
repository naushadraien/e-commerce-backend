import { NextFunction, Request, Response } from "express";
import { Document } from "mongoose";

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void | Response<any, Record<string, any>>>;

export interface UserType extends Document {
  name: string;
  email: string;
  password: string;
  imageUrl: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}
