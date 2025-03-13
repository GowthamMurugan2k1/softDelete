import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";

const createError = (message: string, statusCode: number = 500) => ({
  message,
  statusCode,
});

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err instanceof Prisma.PrismaClientValidationError) {
    ({ message, statusCode } = createError(
      `Validation Error: ${err.message}`,
      400
    ));
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        ({ message, statusCode } = createError(
          `${err.meta?.target} already exists`,
          400
        ));
        break;
      case "P2003":
        ({ message, statusCode } = createError(
          `Foreign Key Constraint Error: ${err.meta?.field_name}`,
          400
        ));
        break;
      case "P2025":
        ({ message, statusCode } = createError(
          `Record not found: ${err.message}`,
          404
        ));
        break;
      default:
        ({ message, statusCode } = createError(
          `Database Error: ${err.message}`,
          500
        ));
        break;
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};


type ControllerType = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void | Response<any, Record<string, any>>>;
  
  export const CatchAsyncHandler =
    (passedFunc: ControllerType) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await passedFunc(req, res, next);
      } catch (error) {
        console.log(error)
        next(error);
      }
    };

