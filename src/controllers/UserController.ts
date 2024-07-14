import { NextFunction, Request, Response } from "express";
import { UserService } from "../service";
import {
    CreateUserRequest,
    limitedUserData,
    UserData,
    userQueryParams,
} from "../types";
import { matchedData, validationResult } from "express-validator";
import createHttpError from "http-errors";

export default class UserController {
    constructor(private userService: UserService) {}
    async create(req: CreateUserRequest, res: Response, next: NextFunction) {
        // Validation
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        const { firstName, lastName, email, password, role, tenantId } =
            req.body;
        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
                role,
                tenantId,
            });
            res.status(201).json({ id: user.id });
        } catch (err) {
            next(err);
        }
    }
    async getAll(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        const validatedQuery = matchedData(req, { locations: ["query"] });
        try {
            const [users, count]: [UserData[], number] =
                await this.userService.getAll(
                    validatedQuery as userQueryParams,
                );

            const response = {
                currentPage: validatedQuery.currentPage,
                perPage: validatedQuery.perPage,
                data: users,
                count,
            };

            res.json(response);
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        const { firstName, lastName, email, role, tenantId } =
            req.body as limitedUserData;
        const userId = req.params.id;
        if (isNaN(Number(userId))) {
            return next(createHttpError(400, "Invalid params"));
        }
        try {
            await this.userService.update(Number(userId), {
                firstName,
                lastName,
                email,
                role,
                tenantId: tenantId,
            });
            res.json({ id: Number(userId) });
        } catch (error) {
            return next(error);
        }
    }
}
