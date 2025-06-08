"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const _1 = require(".");
const logger = winston_1.default.createLogger({
    level: "info",
    defaultMeta: {
        serviceName: "auth-service",
    },
    format: winston_1.default.format.combine(
        winston_1.default.format.timestamp(),
        winston_1.default.format.json(),
    ),
    transports: [
        new winston_1.default.transports.File({
            dirname: "logs",
            filename: "combined.log",
            level: "info",
            silent: _1.Config.NODE_ENV === "test",
        }),
        new winston_1.default.transports.File({
            dirname: "logs",
            filename: "error.log",
            level: "error",
            silent: _1.Config.NODE_ENV === "test",
        }),
        new winston_1.default.transports.Console({
            level: "info",
            silent: _1.Config.NODE_ENV === "test",
        }),
    ],
});
exports.default = logger;
