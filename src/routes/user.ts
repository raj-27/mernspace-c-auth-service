import express, { NextFunction, Request, Response } from "express";
import { UserController } from "../controllers";
import { authenticate, canAccess } from "../middlewares";
import { Roles } from "../constants";
import { UserService } from "../service";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response, next: NextFunction) =>
        userController.create(req, res, next),
);

export default router;
