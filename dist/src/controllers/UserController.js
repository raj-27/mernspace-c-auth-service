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
const express_validator_1 = require("express-validator");
const http_errors_1 = __importDefault(require("http-errors"));
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validation
            const result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                return res.status(400).json({ errors: result.array() });
            }
            const { firstName, lastName, email, password, role, tenantId } = req.body;
            try {
                const user = yield this.userService.create({
                    firstName,
                    lastName,
                    email,
                    password,
                    role,
                    tenantId,
                });
                res.status(201).json({ id: user.id });
            }
            catch (err) {
                next(err);
            }
        });
    }
    getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                return res.status(400).json({ errors: result.array() });
            }
            const validatedQuery = (0, express_validator_1.matchedData)(req, { locations: ["query"] });
            try {
                const [users, count] = yield this.userService.getAll(validatedQuery);
                const response = {
                    currentPage: validatedQuery.currentPage,
                    perPage: validatedQuery.perPage,
                    data: users,
                    count,
                };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                return res.status(400).json({ errors: result.array() });
            }
            const { firstName, lastName, email, role, tenantId } = req.body;
            const userId = req.params.id;
            if (isNaN(Number(userId))) {
                return next((0, http_errors_1.default)(400, "Invalid params"));
            }
            try {
                yield this.userService.update(Number(userId), {
                    firstName,
                    lastName,
                    email,
                    role,
                    tenantId,
                });
                res.json({ id: Number(userId) });
            }
            catch (error) {
                return next(error);
            }
        });
    }
}
exports.default = UserController;
