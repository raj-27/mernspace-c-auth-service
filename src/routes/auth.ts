import express, { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import logger from "../config/logger";
import { AuthRequst } from "../types";
import {
    authenticate,
    parseRefreshToken,
    validateRefreshToken,
} from "../middlewares";
import { CredentialService, TokenService, UserService } from "../service";
import { loginValidator, registerValidator } from "../validators";
import { AuthController } from "../controllers";
import { RefreshToken, User } from "../entity";

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
const tokenService = new TokenService(refreshTokenRepository);
const credentialService = new CredentialService();
const authController = new AuthController(
    userService,
    logger,
    tokenService,
    credentialService,
);

router.post(
    "/register",
    registerValidator,
    (req: Request, res: Response, next: NextFunction) =>
        authController.register(req, res, next),
);

router.post(
    "/login",
    loginValidator,
    (req: Request, res: Response, next: NextFunction) =>
        authController.login(req, res, next),
);

router.get("/self", authenticate, (req: Request, res: Response) =>
    authController.self(req as AuthRequst, res),
);

router.post(
    "/refresh",
    validateRefreshToken,
    (req: Request, res: Response, next: NextFunction) =>
        authController.refresh(req as AuthRequst, res, next),
);

router.post(
    "/logout",
    authenticate,
    parseRefreshToken,
    (req: Request, res: Response, next: NextFunction) =>
        authController.logout(req as AuthRequst, res, next),
);

export default router;
