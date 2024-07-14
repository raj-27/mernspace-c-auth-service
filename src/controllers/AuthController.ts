import { NextFunction, Response } from "express";
import { AuthRequest, RegisterUserRequest } from "../types";
import { Logger } from "winston";
import { JwtPayload } from "jsonwebtoken";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { CredentialService, TokenService, UserService } from "../service";
import { Roles } from "../constants";

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
        const { firstName, lastName, email, password } = req.body;
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array });
        }
        this.logger.debug("New Request to register a user", {
            firstName,
            lastName,
            email,
            password: "*********",
        });
        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
                role: Roles.CUSTOMER,
            });
            this.logger.info("User has been register", { id: user.id });

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };

            const accessToken = this.tokenService.generateAccessToken(payload);

            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user);

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            });

            res.cookie("accessToken", accessToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60, //? 1 Hour
                httpOnly: true, //! Very Important
            });
            res.cookie("refreshToken", refreshToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 365, //? 365 Days
                httpOnly: true, //! Very Important
            });
            res.status(201).json({
                id: user.id,
            });
        } catch (error) {
            next(error);
        }
    }

    // Login User
    async login(req: RegisterUserRequest, res: Response, next: NextFunction) {
        const { email, password } = req.body;
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array });
        }
        this.logger.debug("New Request to Login a user", {
            email,
            password: "*********",
        });
        // send refresh and access token in response
        // return user id in response
        try {
            // Check if user exist in database or not
            const user = await this.userService.findByEmail(email);
            if (!user) {
                const error = createHttpError(
                    400,
                    "Email or passord is incorrect!",
                );
                next(error);
                return;
            }
            this.logger.info("User has been logged in", { id: user.id });

            // Compare password
            const isPasswordMatch =
                await this.CredentialService.comparePassword(
                    password,
                    user.password,
                );
            if (!isPasswordMatch) {
                const error = createHttpError(
                    400,
                    "Email or password is incorrect",
                );
                next(error);
                return;
            }

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };

            const accessToken = this.tokenService.generateAccessToken(payload);

            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user);

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            });

            res.cookie("accessToken", accessToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60, //? 1 Hour
                httpOnly: true, //! Very Important
            });
            res.cookie("refreshToken", refreshToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 365, //? 365 Days
                httpOnly: true, //! Very Important
            });
            res.json({
                id: user.id,
            });
        } catch (error) {
            next(error);
        }
    }

    // Logout User
    async logout(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            await this.tokenService.deleteRefreshToken(Number(req.auth.id));
            this.logger.info("Refresh Token has been deleted!", {
                tokenId: req.auth.id,
            });
            this.logger.info("User has been loged out", {
                id: req.auth.sub,
            });
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            res.json({
                messgae: "User has been loged out!",
            });
        } catch (error) {
            return next(createHttpError(400, "Error While Logoging out!"));
        }
    }

    // Self
    async self(req: AuthRequest, res: Response) {
        const user = await this.userService.findById(Number(req.auth.sub));
        res.json({ ...user, password: undefined });
    }

    // Refresh
    async refresh(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const user = await this.userService.findById(Number(req.auth.sub));

            if (!user) {
                next(createHttpError(400, "User with token could not find"));
                return;
            }
            const payload = {
                sub: String(req.auth.sub),
                role: req.auth.role,
            };

            const accessToken = this.tokenService.generateAccessToken(payload);

            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user);

            // Deleting Old Refresh Token
            await this.tokenService.deleteRefreshToken(Number(req.auth.id));

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            });

            res.cookie("accessToken", accessToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60, //? 1 Hour
                httpOnly: true, //! Very Important
            });
            res.cookie("refreshToken", refreshToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 365, //? 365 Days
                httpOnly: true, //! Very Important
            });
            res.json({
                id: user.id,
            });
        } catch (error) {
            next(createHttpError(400, "Error While Refreshing Refresh Token"));
        }
    }
}
export default AuthController;
