import { Request } from "express";
import { User } from "../entity/User";

export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface RegisterUserRequest extends Request {
    body: UserData;
}

export interface NewRefreshToken {
    user: User;
    expiresAt: number;
    id: string;
}
