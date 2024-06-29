import "reflect-metadata";
import express from "express";
import authRouter from "./routes/auth";
import tenantRouter from "./routes/tenant";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares";

const app = express();
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());

app.get("/", async (req, res) => {
    res.send("Welcome to auth service");
});

app.use("/auth", authRouter);
app.use("/tenants", tenantRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(globalErrorHandler);

export default app;
