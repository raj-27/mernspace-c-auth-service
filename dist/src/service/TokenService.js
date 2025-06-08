"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const http_errors_1 = __importDefault(require("http-errors"));
const config_1 = require("../config");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
class TokenService {
    constructor(refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }
    /**
     * The function generates an access token using a private key and a payload with specified options.
     * @param {JwtPayload} payload - The `payload` parameter in the `generateAccessToken` function
     * typically contains the data that you want to include in the JWT (JSON Web Token). This data can
     * be any information that you want to encode into the token, such as user details, permissions, or
     * any other relevant information.
     * @returns The function `generateAccessToken` is returning the access token generated using the
     * provided `payload` and private key read from the file.
     */
    generateAccessToken(payload) {
        let privateKey;
        try {
            privateKey = node_fs_1.default.readFileSync(node_path_1.default.join(__dirname, "../../certs/private.pem"));
        }
        catch (err) {
            const error = (0, http_errors_1.default)(500, "Error while reading private key");
            throw error;
        }
        try {
            const accessToken = (0, jsonwebtoken_1.sign)(payload, privateKey, {
                algorithm: "RS256",
                expiresIn: "1h",
                issuer: "auth-service",
            });
            return accessToken;
        }
        catch (error) {
            const err = (0, http_errors_1.default)(400, "Error While Generating Access Token");
            throw err;
        }
    }
    /**
     * The function generates a refresh token using a given payload and specific configurations.
     * @param {JwtPayload} payload - The `generateRefreshToken` function takes a `JwtPayload` object as a
     * parameter. This payload typically contains information that will be encoded into the refresh
     * token, such as the user's ID, role, and any other relevant data needed for authentication and
     * authorization purposes.
     * @returns The function `generateRefreshToken` is returning a refresh token generated using the
     * `sign` method from a JWT library. The refresh token is signed with a secret key from the
     * `Config.REFRESH_TOKEN_SECRET` and includes specific options such as algorithm, expiration time,
     * issuer, and JWT ID. The generated refresh token is then returned by the function.
     */
    generateRefreshToken(payload) {
        try {
            const refreshToken = (0, jsonwebtoken_1.sign)(payload, config_1.Config.REFRESH_TOKEN_SECRET, {
                algorithm: "HS256",
                expiresIn: "1y",
                issuer: "auth-service",
                jwtid: payload.id,
            });
            return refreshToken;
        }
        catch (error) {
            const err = (0, http_errors_1.default)(500, "Error while generating refresh token");
            throw err;
        }
    }
    /**
     * The function `persistRefreshToken` saves a new refresh token for a user with an expiration date
     * set to one year in the future.
     * @param {User} user - The `user` parameter in the `persistRefreshToken` function likely
     * represents the user for whom a new refresh token is being generated and saved. It could contain
     * information such as the user's ID, username, email, and any other relevant user data needed for
     * creating and associating the refresh token with
     * @returns The `persistRefreshToken` function is returning the newly saved refresh token object.
     */
    persistRefreshToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;
            const newRefreshToken = yield this.refreshTokenRepository.save({
                user,
                expiresAt: new Date(Date.now() + MS_IN_YEAR),
            });
            return newRefreshToken;
        });
    }
    deleteRefreshToken(tokenId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.refreshTokenRepository.delete({ id: tokenId });
        });
    }
}
exports.default = TokenService;
