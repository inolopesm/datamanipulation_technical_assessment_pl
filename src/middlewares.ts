import type { NextFunction, Request, Response } from "express";
import * as multer from "multer";

export const file = multer({ storage: multer.memoryStorage() }).single("file");

export function notFound(req: Request, res: Response): void {
  res.send({ message: "route not found" });
}

export function error(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(err);
  res.send({ message: "internal server error" });
}
