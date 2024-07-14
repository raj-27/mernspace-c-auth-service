import express, { NextFunction, Request, Response } from "express";
import { UserController } from "../controllers";
import { authenticate, canAccess } from "../middlewares";
import { Roles } from "../constants";
import { UserService } from "../service";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity";
import listUsersValidator from "../validators/list-users-validator";
import { updateUserValidator } from "../validators";

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

router.patch(
    "/:id",
    authenticate,
    canAccess([Roles.ADMIN]),
    updateUserValidator,
    (req: Request, res: Response, next: NextFunction) =>
        userController.update(req, res, next),
);

router.get(
    "/",
    authenticate,
    canAccess([Roles.ADMIN]),
    listUsersValidator,
    (req: Request, res: Response, next: NextFunction) =>
        userController.getAll(req, res, next),
);

export default router;
