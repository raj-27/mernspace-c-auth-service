"use strict";
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step(
                (generator = generator.apply(thisArg, _arguments || [])).next(),
            );
        });
    };
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const http_errors_1 = __importDefault(require("http-errors"));
const constants_1 = require("../constants");
class AuthController {
    constructor(userService, logger, tokenService, CredentialService) {
        this.userService = userService;
        this.logger = logger;
        this.tokenService = tokenService;
        this.CredentialService = CredentialService;
    }
    // Register User
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, email, password } = req.body;
            const result = (0, express_validator_1.validationResult)(req);
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
                const user = yield this.userService.create({
                    firstName,
                    lastName,
                    email,
                    password,
                    role: constants_1.Roles.CUSTOMER,
                });
                this.logger.info("User has been register", { id: user.id });
                const payload = {
                    sub: String(user.id),
                    role: user.role,
                };
                const accessToken =
                    this.tokenService.generateAccessToken(payload);
                const newRefreshToken =
                    yield this.tokenService.persistRefreshToken(user);
                const refreshToken = this.tokenService.generateRefreshToken(
                    Object.assign(Object.assign({}, payload), {
                        id: String(newRefreshToken.id),
                    }),
                );
                res.cookie("accessToken", accessToken, {
                    domain: "localhost",
                    sameSite: "strict",
                    maxAge: 1000 * 60 * 60,
                    httpOnly: true, //! Very Important
                });
                res.cookie("refreshToken", refreshToken, {
                    domain: "localhost",
                    sameSite: "strict",
                    maxAge: 1000 * 60 * 60 * 24 * 365,
                    httpOnly: true, //! Very Important
                });
                res.status(201).json({
                    id: user.id,
                });
            } catch (error) {
                next(error);
            }
        });
    }
    // Login User
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const result = (0, express_validator_1.validationResult)(req);
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
                const user = yield this.userService.findByEmail(email);
                if (!user) {
                    const error = (0, http_errors_1.default)(
                        400,
                        "Email or passord is incorrect!",
                    );
                    next(error);
                    return;
                }
                this.logger.info("User has been logged in", { id: user.id });
                // Compare password
                const isPasswordMatch =
                    yield this.CredentialService.comparePassword(
                        password,
                        user.password,
                    );
                if (!isPasswordMatch) {
                    const error = (0, http_errors_1.default)(
                        400,
                        "Email or password is incorrect",
                    );
                    next(error);
                    return;
                }
                const payload = {
                    sub: String(user.id),
                    role: user.role,
                };
                const accessToken =
                    this.tokenService.generateAccessToken(payload);
                const newRefreshToken =
                    yield this.tokenService.persistRefreshToken(user);
                const refreshToken = this.tokenService.generateRefreshToken(
                    Object.assign(Object.assign({}, payload), {
                        id: String(newRefreshToken.id),
                    }),
                );
                res.cookie("accessToken", accessToken, {
                    domain: "localhost",
                    sameSite: "strict",
                    maxAge: 1000 * 60 * 60,
                    httpOnly: true, //! Very Important
                });
                res.cookie("refreshToken", refreshToken, {
                    domain: "localhost",
                    sameSite: "strict",
                    maxAge: 1000 * 60 * 60 * 24 * 365,
                    httpOnly: true, //! Very Important
                });
                res.json({
                    id: user.id,
                });
            } catch (error) {
                next(error);
            }
        });
    }
    // Logout User
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.tokenService.deleteRefreshToken(Number(req.auth.id));
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
                return next(
                    (0, http_errors_1.default)(
                        400,
                        "Error While Logoging out!",
                    ),
                );
            }
        });
    }
    // Self
    self(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.findById(Number(req.auth.sub));
            res.json(
                Object.assign(Object.assign({}, user), { password: undefined }),
            );
        });
    }
    // Refresh
    refresh(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.findById(
                    Number(req.auth.sub),
                );
                if (!user) {
                    next(
                        (0, http_errors_1.default)(
                            400,
                            "User with token could not find",
                        ),
                    );
                    return;
                }
                const payload = {
                    sub: String(req.auth.sub),
                    role: req.auth.role,
                };
                const accessToken =
                    this.tokenService.generateAccessToken(payload);
                const newRefreshToken =
                    yield this.tokenService.persistRefreshToken(user);
                // Deleting Old Refresh Token
                yield this.tokenService.deleteRefreshToken(Number(req.auth.id));
                const refreshToken = this.tokenService.generateRefreshToken(
                    Object.assign(Object.assign({}, payload), {
                        id: String(newRefreshToken.id),
                    }),
                );
                res.cookie("accessToken", accessToken, {
                    domain: "localhost",
                    sameSite: "strict",
                    maxAge: 1000 * 60 * 60,
                    httpOnly: true, //! Very Important
                });
                res.cookie("refreshToken", refreshToken, {
                    domain: "localhost",
                    sameSite: "strict",
                    maxAge: 1000 * 60 * 60 * 24 * 365,
                    httpOnly: true, //! Very Important
                });
                res.json({
                    id: user.id,
                });
            } catch (error) {
                next(
                    (0, http_errors_1.default)(
                        400,
                        "Error While Refreshing Refresh Token",
                    ),
                );
            }
        });
    }
}
exports.default = AuthController;
