import { NextFunction, Response } from "express";
import { UserService } from "../service";
import { CreateUserRequest } from "../types";
import { validationResult } from "express-validator";

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
}
