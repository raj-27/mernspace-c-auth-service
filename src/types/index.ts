import { Request } from "express";

export interface limitedUserData {
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    tenantId?: number;
}

export interface UserData extends limitedUserData {
    password: string;
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

export interface userQueryParams extends TenantQueryParams {
    role: string;
}
