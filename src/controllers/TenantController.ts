import { NextFunction, Response } from "express";
import createHttpError from "http-errors";
import { TenantService } from "../service";
import { CreateTenantRequest, TenantQueryParams } from "../types";
import { Logger } from "winston";
import { Request } from "express-jwt";
import { matchedData, validationResult } from "express-validator";

export default class TenantController {
    constructor(
        private tenantService: TenantService,
        private logger: Logger,
    ) {}

    // Method for creating new tenant
    async create(req: CreateTenantRequest, res: Response, next: NextFunction) {
        const { name, address } = req.body;
        try {
            const tenant = await this.tenantService.create({ name, address });
            this.logger.info(
                `Tenant created successfully tenant id ${tenant.id}`,
            );
            res.status(201).json({ id: tenant.id });
        } catch (error) {
            next(createHttpError(400, "Error while creating tenant"));
            return;
        }
    }

    async update(req: CreateTenantRequest, res: Response, next: NextFunction) {
        // Validation
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array });
        }

        const { name, address } = req.body;
        const tenantId = req.params.id;
        if (isNaN(Number(tenantId))) {
            next(createHttpError(400, "Invalid url params"));
            return;
        }
        this.logger.info(`Request for updating a tenant and id: ${tenantId}`);
        try {
            await this.tenantService.update(Number(tenantId), {
                name,
                address,
            });
            this.logger.info(`Tenant is successfuly and id : ${tenantId}`);
            res.json({ id: Number(tenantId) });
        } catch (error) {
            next(createHttpError(400, "Error while updating tenant"));
            return;
        }
    }

    // Method to get list of all tenant
    async getAll(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        const validatedQuery = matchedData(req, {
            locations: ["query"],
        }) as TenantQueryParams;
        try {
            const [tenants, count] =
                await this.tenantService.getAll(validatedQuery);
            res.json({
                currentPage: validatedQuery.currentPage,
                perPage: validatedQuery.perPage,
                data: tenants,
                count,
            });
        } catch (error) {
            return next(
                createHttpError(400, "Error while getting tenant list"),
            );
        }
    }

    // Method to get single tenant by id
    async getOne(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array });
        }
        const tenantId = req.params.id;
        if (isNaN(Number(tenantId))) {
            next(createHttpError(400, "Invalid url parameters!"));
            return;
        }
        this.logger.info(`Request for getting single tenant,Id:${tenantId}`);
        try {
            const tenant = await this.tenantService.getOne(Number(tenantId));
            if (!tenant) {
                next(createHttpError(400, "Tenant does not exist."));
                return;
            }
            this.logger.info(`successfully get tenant,Id:${tenantId}`);
            res.json(tenant);
        } catch (error) {
            next(error);
            return;
        }
    }

    // Method to delete a tenant by id
    async deleteById(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array });
        }
        const tenantId = req.params.id;
        if (isNaN(Number(tenantId))) {
            next(createHttpError(400, "Inavalid url paramater."));
            return;
        }
        try {
            await this.tenantService.deleteById(Number(tenantId));
            this.logger.info(`Tenant has been deleted,Id:${tenantId}`);
            res.json({ id: Number(tenantId) });
        } catch (error) {
            next(error);
        }
    }
}
