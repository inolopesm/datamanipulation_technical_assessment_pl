import type { NextFunction, Request, Response } from "express";
import * as multer from "multer";
import * as pino from "./pino";

export const file = multer({ storage: multer.memoryStorage() }).single("file");

export function logger(req: Request, res: Response, next: NextFunction): void {
  const { method, url } = req;
  const start = Date.now();

  res.on("finish", () => {
    const { statusCode: status } = res;
    const contentLength = res.getHeader("content-length");
    const responseTime = Date.now() - start;
    pino.logger.info({ method, url, status, contentLength, responseTime });
  });

  next();
}

export function notFound(req: Request, res: Response): void {
  res.status(404);
  res.send({ message: "route not found" });
}

export function error(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { name, message, stack, cause } = err;
  pino.logger.error({ name, message, stack, cause });
  res.status(500);
  res.send({ message: "internal server error" });
}
