import { NextFunction, Response } from "express";
import { AuthRequest, RegisterUserRequest } from "../types";
import { Logger } from "winston";
import { JwtPayload } from "jsonwebtoken";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { CredentialService, TokenService, UserService } from "../service";
import { Roles } from "../constants";
import { Config } from "../config";

class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
        private tokenService: TokenService,
        private CredentialService: CredentialService,
    ) {}

    // Register User
    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        const requestId = req.headers["x-request-id"] || "N/A";
        const { firstName, lastName, email, password } = req.body;

        this.logger.info("Register request received", {
            requestId,
            email,
            ip: req.ip,
        });

        const result = validationResult(req);

        if (!result.isEmpty()) {
            this.logger.warn("Register validation failed", {
                requestId,
                email,
                errors: result.array(),
            });

            return res.status(400).json({ errors: result.array() });
        }

        try {
            this.logger.debug("Creating new user", {
                requestId,
                email,
                role: Roles.CUSTOMER,
            });

            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
                role: Roles.ADMIN,
            });

            this.logger.info("User created successfully", {
                requestId,
                userId: user.id,
                email,
            });

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
                firstName,
                lastName,
                email,
            };

            this.logger.debug("Generating access token", {
                requestId,
                userId: user.id,
            });

            const accessToken = this.tokenService.generateAccessToken(payload);

            this.logger.debug("Persisting refresh token", {
                requestId,
                userId: user.id,
            });

            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user);

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            });

            this.logger.info("Tokens generated successfully", {
                requestId,
                userId: user.id,
                refreshTokenId: newRefreshToken.id,
            });

            res.cookie("accessToken", accessToken, {
                domain: Config.MAIN_DOMAIN,
                sameSite: "strict",
                maxAge: 1000 * 60 * 60,
                httpOnly: true,
            });

            res.cookie("refreshToken", refreshToken, {
                domain: Config.MAIN_DOMAIN,
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 365,
                httpOnly: true,
            });

            this.logger.info("Register process completed successfully", {
                requestId,
                userId: user.id,
            });

            res.status(201).json({
                id: user.id,
            });
        } catch (error: any) {
            this.logger.error("User registration failed", {
                requestId,
                email,
                errorMessage: error?.message,
                stack: error?.stack,
            });

            next(error);
        }
    }

    // Login User
    async login(req: RegisterUserRequest, res: Response, next: NextFunction) {
        const requestId = req.headers["x-request-id"] || "N/A";
        const { email, password } = req.body;

        this.logger.info("Login request received", {
            requestId,
            email,
            ip: req.ip,
        });

        const result = validationResult(req);

        if (!result.isEmpty()) {
            this.logger.warn("Login validation failed", {
                requestId,
                email,
                errors: result.array(),
            });

            return res.status(400).json({ errors: result.array() });
        }

        try {
            this.logger.debug("Fetching user by email", {
                requestId,
                email,
            });

            const user = await this.userService.findByEmail(email);

            if (!user) {
                this.logger.warn("Login failed - user not found", {
                    requestId,
                    email,
                });

                return next(
                    createHttpError(400, "Email or password is incorrect"),
                );
            }

            this.logger.debug("Comparing password", {
                requestId,
                userId: user.id,
            });

            const isPasswordMatch =
                await this.CredentialService.comparePassword(
                    password,
                    user.password,
                );

            if (!isPasswordMatch) {
                this.logger.warn("Login failed - invalid password", {
                    requestId,
                    userId: user.id,
                });

                return next(
                    createHttpError(400, "Email or password is incorrect"),
                );
            }

            this.logger.info("User authenticated successfully", {
                requestId,
                userId: user.id,
                role: user.role,
            });

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            };

            this.logger.debug("Generating tokens", {
                requestId,
                userId: user.id,
            });

            const accessToken = this.tokenService.generateAccessToken(payload);

            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user);

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            });

            this.logger.info("Tokens generated successfully", {
                requestId,
                userId: user.id,
                refreshTokenId: newRefreshToken.id,
            });

            res.cookie("accessToken", accessToken, {
                domain: Config.MAIN_DOMAIN,
                sameSite: "strict",
                maxAge: 1000 * 60 * 60,
                httpOnly: true,
            });

            res.cookie("refreshToken", refreshToken, {
                domain: Config.MAIN_DOMAIN,
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 365,
                httpOnly: true,
            });

            this.logger.info("Login process completed successfully", {
                requestId,
                userId: user.id,
            });

            res.json({ id: user.id });
        } catch (error: any) {
            this.logger.error("Login process failed", {
                requestId,
                email,
                errorMessage: error.message,
                stack: error.stack,
            });

            next(error);
        }
    }

    // Logout User
    async logout(req: AuthRequest, res: Response, next: NextFunction) {
        const requestId = req.headers["x-request-id"] || "N/A";
        const userId = req.auth?.sub;
        const refreshTokenId = req.auth?.id;

        this.logger.info("Logout request received", {
            requestId,
            userId,
            ip: req.ip,
        });

        try {
            this.logger.debug("Deleting refresh token", {
                requestId,
                refreshTokenId,
            });

            await this.tokenService.deleteRefreshToken(Number(refreshTokenId));

            this.logger.info("Refresh token deleted successfully", {
                requestId,
                refreshTokenId,
            });

            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");

            this.logger.info("User logged out successfully", {
                requestId,
                userId,
            });

            res.json({
                message: "User logged out successfully",
            });
        } catch (error: any) {
            this.logger.error("Logout process failed", {
                requestId,
                userId,
                errorMessage: error.message,
                stack: error.stack,
            });

            return next(createHttpError(400, "Error while logging out"));
        }
    }

    // Self
    async self(req: AuthRequest, res: Response, next: NextFunction) {
        const requestId = req.headers["x-request-id"] || "N/A";
        const userId = req.auth?.sub;

        this.logger.info("Self endpoint request received", {
            requestId,
            userId,
            ip: req.ip,
        });

        try {
            if (!userId) {
                this.logger.warn("Self request failed - missing auth context", {
                    requestId,
                });

                return next(createHttpError(401, "Unauthorized access"));
            }

            this.logger.debug("Fetching user by ID", {
                requestId,
                userId,
            });

            const user = await this.userService.findById(Number(userId));

            if (!user) {
                this.logger.warn("User not found for provided token", {
                    requestId,
                    userId,
                });

                return next(
                    createHttpError(404, "User not found for the given token"),
                );
            }

            this.logger.info("User details fetched successfully", {
                requestId,
                userId,
            });

            res.json({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            });
        } catch (error: any) {
            this.logger.error("Self endpoint failed", {
                requestId,
                userId,
                errorMessage: error.message,
                stack: error.stack,
            });

            next(
                createHttpError(
                    500,
                    "Failed to fetch user details for the current session",
                ),
            );
        }
    }

    // Refresh
    async refresh(req: AuthRequest, res: Response, next: NextFunction) {
        const requestId = req.headers["x-request-id"] || "N/A";
        const userId = req.auth?.sub;
        const oldRefreshTokenId = req.auth?.id;

        this.logger.info("Refresh token request received", {
            requestId,
            userId,
            ip: req.ip,
        });

        try {
            if (!userId || !oldRefreshTokenId) {
                this.logger.warn("Refresh failed - invalid auth context", {
                    requestId,
                    userId,
                });

                return next(
                    createHttpError(401, "Invalid authentication context"),
                );
            }

            this.logger.debug("Fetching user for refresh", {
                requestId,
                userId,
            });

            const user = await this.userService.findById(Number(userId));

            if (!user) {
                this.logger.warn("Refresh failed - user not found", {
                    requestId,
                    userId,
                });

                return next(
                    createHttpError(
                        400,
                        "User associated with token not found",
                    ),
                );
            }

            const payload = {
                sub: String(userId),
                role: req.auth.role,
            };

            this.logger.debug("Generating new access token", {
                requestId,
                userId,
            });

            const accessToken = this.tokenService.generateAccessToken(payload);

            this.logger.debug("Persisting new refresh token", {
                requestId,
                userId,
            });

            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user);

            this.logger.debug("Deleting old refresh token", {
                requestId,
                oldRefreshTokenId,
            });

            await this.tokenService.deleteRefreshToken(
                Number(oldRefreshTokenId),
            );

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            });

            this.logger.info("Token rotation successful", {
                requestId,
                userId,
                newRefreshTokenId: newRefreshToken.id,
            });

            res.cookie("accessToken", accessToken, {
                domain: Config.MAIN_DOMAIN,
                sameSite: "strict",
                maxAge: 1000 * 60 * 60,
                httpOnly: true,
            });

            res.cookie("refreshToken", refreshToken, {
                domain: Config.MAIN_DOMAIN,
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 365,
                httpOnly: true,
            });

            this.logger.info("Refresh process completed successfully", {
                requestId,
                userId,
            });

            res.json({
                id: user.id,
            });
        } catch (error: any) {
            this.logger.error("Refresh token process failed", {
                requestId,
                userId,
                errorMessage: error.message,
                stack: error.stack,
            });

            next(
                createHttpError(
                    400,
                    "Error while refreshing authentication tokens",
                ),
            );
        }
    }
}
export default AuthController;
