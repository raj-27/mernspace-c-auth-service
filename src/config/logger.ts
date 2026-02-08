import winston from "winston";
import { Config } from ".";

const logFormat = winston.format.printf(
    ({ level, message, timestamp, stack, serviceName }) => {
        return JSON.stringify({
            level,
            message,
            stack, // 🔥 THIS IS IMPORTANT
            serviceName,
            timestamp,
        });
    },
);

const logger = winston.createLogger({
    level: "info",
    defaultMeta: {
        serviceName: "auth-service",
    },
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }), // already correct
        logFormat, // 🔥 ADD THIS
    ),
    transports: [
        new winston.transports.File({
            dirname: "logs",
            filename: "combined.log",
            level: "info",
            silent: Config.NODE_ENV === "test",
        }),
        new winston.transports.File({
            dirname: "logs",
            filename: "error.log",
            level: "error",
            silent: Config.NODE_ENV === "test",
        }),
        new winston.transports.Console({
            level: "info",
            silent: Config.NODE_ENV === "test",
        }),
    ],
});

export default logger;
