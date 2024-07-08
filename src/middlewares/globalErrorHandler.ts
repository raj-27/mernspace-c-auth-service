import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import logger from "../config/logger";

const globalErrorHandler = (
    err: HttpError,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
) => {
    const statusCode = err.status || 500;

    const isProduction = process.env.NODE_ENV === "production";
    let message = "Internal server error";
    if (statusCode === 400) {
        message = err.message;
    }

    logger.error(err.message, {
        statusCode,
        error: err.stack,
        path: req.path,
        method: req.method,
    });

    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                msg: message,
                path: req.path,
                method: req.method,
                location: "server",
                stack: isProduction ? null : err.stack,
            },
        ],
    });
};

export default globalErrorHandler;
