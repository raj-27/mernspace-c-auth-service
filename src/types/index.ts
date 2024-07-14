import { Request } from "express";

export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    tenantId?: number;
}
export interface RegisterUserRequest extends Request {
    body: UserData;
}

export interface AuthRequst extends Request {
    auth: {
        sub: number;
        role: string;
        id?: string;
    };
}

export interface AuthCookie {
    accessToken: string;
    refreshToken: string;
}

export interface iRefreshTokenPayload {
    id: string;
}

export interface ITenant {
    name: string;
    address: string;
}

export interface CreateTenantRequest extends Request {
    body: ITenant;
}

export interface TenantQueryParams {
    q: string;
    perPage: number;
    currentPage: number;
}

export interface CreateUserRequest extends Request {
    body: UserData;
}

export interface userQueryParams {
    perPage: number;
    currentPage: number;
    q: string;
    role: string;
}

export interface tenantQueryParams {
    perPage: number;
    currentPage: number;
    q: string;
}

export interface limitedUserData {
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    tenantId: number | null | undefined;
}
