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
const express_jwt_1 = require("express-jwt");
const config_1 = require("../config");
const data_source_1 = require("../config/data-source");
const logger_1 = __importDefault(require("../config/logger"));
const entity_1 = require("../entity");
exports.default = (0, express_jwt_1.expressjwt)({
    secret: config_1.Config.REFRESH_TOKEN_SECRET,
    algorithms: ["HS256"],
    getToken(req) {
        const { refreshToken } = req.cookies;
        return refreshToken;
    },
    isRevoked(request, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshTokenRepo = data_source_1.AppDataSource.getRepository(entity_1.RefreshToken);
                const refreshToken = yield refreshTokenRepo.findOne({
                    where: {
                        id: Number((token === null || token === void 0 ? void 0 : token.payload).id),
                        user: { id: Number(token === null || token === void 0 ? void 0 : token.payload.sub) },
                    },
                });
                return refreshToken === null;
            }
            catch (err) {
                logger_1.default.error("Error while getting the refresh token", {
                    id: (token === null || token === void 0 ? void 0 : token.payload).id,
                });
            }
            return true;
        });
    },
});
