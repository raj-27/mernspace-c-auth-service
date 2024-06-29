import express from "express";
import { TenantController } from "../controllers";
import { TenantService } from "../service";
import { AppDataSource } from "../config/data-source";
import { Tenant } from "../entity";
import logger from "../config/logger";
import { authenicate } from "../middlewares";

const router = express.Router();
const tenantRepository = AppDataSource.getRepository(Tenant);
const tenantService = new TenantService(tenantRepository);
const tenantController = new TenantController(tenantService, logger);

router.post("/", authenicate, (req, res, next) =>
    tenantController.create(req, res, next),
);

export default router;
