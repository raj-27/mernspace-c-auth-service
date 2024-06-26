import { NextFunction, Response } from "express";
import { RegisterUserRequest } from "../types";
import { UserService } from "../service/UserService";
import { Logger } from "winston";
import { JwtPayload } from "jsonwebtoken";
import { validationResult } from "express-validator";
import { TokenService } from "../service/TokenService";
import createHttpError from "http-errors";
import { CredentialService } from "../service/CredentialService";

export class AuthController {
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
}
