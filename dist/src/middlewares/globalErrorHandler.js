"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../config/logger"));
const globalErrorHandler = (
    err,
    req,
    res,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next,
) => {
    const statusCode = err.status || 500;
    const isProduction = process.env.NODE_ENV === "production";
    let message = "Internal server error";
    if (statusCode === 400) {
        message = err.message;
    }
    logger_1.default.error(err.message, {
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
exports.default = globalErrorHandler;
