import fs from "fs";
import path from "path";
import { JwtPayload, sign } from "jsonwebtoken";
import createHttpError from "http-errors";
import { Config } from "../config";

export class TokenService {
    generateAccessToken(payload: JwtPayload) {
        let privateKey: Buffer;
        try {
            privateKey = fs.readFileSync(
                path.join(__dirname, "../../certs/private.pem"),
            );
        } catch (err) {
            const error = createHttpError(
                500,
                "Error while reading private key",
            );
            throw error;
        }
        try {
            const accessToken = sign(payload, privateKey, {
                algorithm: "RS256",
                expiresIn: "1h",
                issuer: "auth-service",
            });
            return accessToken;
        } catch (error) {
            const err = createHttpError(
                400,
                "Error While Generating Access Token",
            );
            throw err;
        }
    }

    generateRefreshToken(payload: JwtPayload) {
        try {
            const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
                algorithm: "HS256",
                expiresIn: "1y",
                issuer: "auth-service",
                jwtid: payload.id as string,
            });

            return refreshToken;
        } catch (error) {
            const err = createHttpError(
                500,
                "Error while generating refresh token",
            );
            throw err;
        }
    }
}
