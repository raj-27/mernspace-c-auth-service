import { expressjwt, GetVerificationKey } from "express-jwt";
import { Request } from "express";
import jwksClient from "jwks-rsa";
import { Config } from "../config";
import { AuthCookie } from "../types";
import logger from "../config/logger";

logger.debug("JWT middleware triggered", {
    jwksUri: Config.JWKS_URI!,
});

export default expressjwt({
    secret: jwksClient.expressJwtSecret({
        jwksUri: Config.JWKS_URI!,
        cache: true,
        rateLimit: true,
    }) as GetVerificationKey,

    algorithms: ["RS256"],

    getToken(req: Request) {
        try {
            logger.debug("JWT middleware triggered", {
                path: req.originalUrl,
                method: req.method,
                jwksUri: Config.JWKS_URI!,
            });

            const authHeader = req.headers.authorization;

            if (authHeader) {
                const token = authHeader.split(" ")[1];

                if (token && token !== "undefined") {
                    logger.info(
                        "JWT token extracted from Authorization header",
                        {
                            source: "header",
                            tokenPreview: token.substring(0, 10) + "...",
                        },
                    );
                    return token;
                }
            }

            const { accessToken } = req.cookies as AuthCookie;

            if (accessToken) {
                logger.info("JWT token extracted from cookies", {
                    source: "cookie",
                    tokenPreview: accessToken.substring(0, 10) + "...",
                });
                return accessToken;
            }

            logger.warn("No JWT token found in request", {
                path: req.originalUrl,
                method: req.method,
            });

            return undefined;
        } catch (error) {
            logger.error("Error while extracting JWT token", {
                error: error instanceof Error ? error.message : error,
                stack: error instanceof Error ? error.stack : undefined,
            });

            return undefined;
        }
    },
});
