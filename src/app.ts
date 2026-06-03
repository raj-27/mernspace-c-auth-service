import "reflect-metadata";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import tenantRouter from "./routes/tenant";
import userRouter from "./routes/user";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares";
import { Config } from "./config/index";
import logger from "./config/logger";

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

const ALLOWED_DOMAINS = [
    Config.ADMIN_URI,
    Config.API_GATEWAY_URL,
    "http://localhost:5173",
];

logger.info("Allowed Domains", {
    ALLOWED_DOMAINS,
});

app.use(
    cors({
        origin: ALLOWED_DOMAINS as string[],
        methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
        credentials: true,
    }),
);
app.get("/", async (req, res) => {
    res.send("Welcome to auth service");
});

app.use("/auth", authRouter);
app.use("/tenants", tenantRouter);
app.use("/users", userRouter);

app.use(globalErrorHandler);

export default app;
