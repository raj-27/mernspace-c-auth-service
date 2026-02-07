import { JwtPayload, sign } from "jsonwebtoken";
import createHttpError from "http-errors";
import { Config } from "../config";
import { Repository } from "typeorm";
import { RefreshToken, User } from "../entity";
import fs from "node:fs";
import path from "node:path";

class TokenService {
    constructor(private refreshTokenRepository: Repository<RefreshToken>) {}

    /**
     * The function generates an access token using a private key and a payload with specified options.
     * @param {JwtPayload} payload - The `payload` parameter in the `generateAccessToken` function
     * typically contains the data that you want to include in the JWT (JSON Web Token). This data can
     * be any information that you want to encode into the token, such as user details, permissions, or
     * any other relevant information.
     * @returns The function `generateAccessToken` is returning the access token generated using the
     * provided `payload` and private key read from the file.
     */
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
            console.log("Access Token: ", accessToken);

            return accessToken;
        } catch (error) {
            const err = createHttpError(
                400,
                "Error While Generating Access Token",
            );
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

    /**
     * The function `persistRefreshToken` saves a new refresh token for a user with an expiration date
     * set to one year in the future.
     * @param {User} user - The `user` parameter in the `persistRefreshToken` function likely
     * represents the user for whom a new refresh token is being generated and saved. It could contain
     * information such as the user's ID, username, email, and any other relevant user data needed for
     * creating and associating the refresh token with
     * @returns The `persistRefreshToken` function is returning the newly saved refresh token object.
     */
    async persistRefreshToken(user: User) {
        const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;
        const newRefreshToken = await this.refreshTokenRepository.save({
            user,
            expiresAt: new Date(Date.now() + MS_IN_YEAR),
        });
        return newRefreshToken;
    }

    async deleteRefreshToken(tokenId: number) {
        await this.refreshTokenRepository.delete({ id: tokenId });
    }
}
export default TokenService;
