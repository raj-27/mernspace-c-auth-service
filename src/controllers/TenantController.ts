import { NextFunction, Response } from "express";
import createHttpError from "http-errors";
import { TenantService } from "../service";
import { CreateTenantRequest } from "../types";
import { Logger } from "winston";

export default class TenantController {
    constructor(
        private tenantService: TenantService,
        private logger: Logger,
    ) {}
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
}
