import "reflect-metadata";
import express from "express";
import authRouter from "./routes/auth";
import tenantRouter from "./routes/tenant";
import userRouter from "./routes/user";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares";

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

app.get("/", async (req, res) => {
    res.send("Welcome to auth service");
});

app.use("/auth", authRouter);
app.use("/tenants", tenantRouter);
app.use("/users", userRouter);

app.use(globalErrorHandler);

export default app;
