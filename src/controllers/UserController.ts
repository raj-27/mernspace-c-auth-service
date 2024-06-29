import { NextFunction, Response } from "express";
import { UserService } from "../service";
import { CreateUserRequest } from "../types";
import { validationResult } from "express-validator";
import { Roles } from "../constants";

export default class UserController {
    constructor(private userService: UserService) {}
    async create(req: CreateUserRequest, res: Response, next: NextFunction) {
        // Validation
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { firstName, lastName, email, password } = req.body;
        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
                role: Roles.MANAGER,
            });
            res.status(201).json({ id: user.id });
        } catch (err) {
            next(err);
        }
    }
}
