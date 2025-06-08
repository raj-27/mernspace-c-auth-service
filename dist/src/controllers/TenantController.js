"use strict";
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step(
                (generator = generator.apply(thisArg, _arguments || [])).next(),
            );
        });
    };
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_validator_1 = require("express-validator");
class TenantController {
    constructor(tenantService, logger) {
        this.tenantService = tenantService;
        this.logger = logger;
    }
    // Method for creating new tenant
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, address } = req.body;
            try {
                const tenant = yield this.tenantService.create({
                    name,
                    address,
                });
                this.logger.info(
                    `Tenant created successfully tenant id ${tenant.id}`,
                );
                res.status(201).json({ id: tenant.id });
            } catch (error) {
                next(
                    (0, http_errors_1.default)(
                        400,
                        "Error while creating tenant",
                    ),
                );
                return;
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validation
            const result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                res.status(400).json({ errors: result.array });
            }
            const { name, address } = req.body;
            const tenantId = req.params.id;
            if (isNaN(Number(tenantId))) {
                next((0, http_errors_1.default)(400, "Invalid url params"));
                return;
            }
            this.logger.info(
                `Request for updating a tenant and id: ${tenantId}`,
            );
            try {
                yield this.tenantService.update(Number(tenantId), {
                    name,
                    address,
                });
                this.logger.info(`Tenant is successfuly and id : ${tenantId}`);
                res.json({ id: Number(tenantId) });
            } catch (error) {
                next(
                    (0, http_errors_1.default)(
                        400,
                        "Error while updating tenant",
                    ),
                );
                return;
            }
        });
    }
    // Method to get list of all tenant
    getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                return res.status(400).json({ errors: result.array() });
            }
            const validatedQuery = (0, express_validator_1.matchedData)(req, {
                locations: ["query"],
            });
            try {
                const [tenants, count] =
                    yield this.tenantService.getAll(validatedQuery);
                res.json({
                    currentPage: validatedQuery.currentPage,
                    perPage: validatedQuery.perPage,
                    data: tenants,
                    count,
                });
            } catch (error) {
                return next(
                    (0, http_errors_1.default)(
                        400,
                        "Error while getting tenant list",
                    ),
                );
            }
        });
    }
    // Method to get single tenant by id
    getOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                res.status(400).json({ errors: result.array });
            }
            const tenantId = req.params.id;
            if (isNaN(Number(tenantId))) {
                next(
                    (0, http_errors_1.default)(400, "Invalid url parameters!"),
                );
                return;
            }
            this.logger.info(
                `Request for getting single tenant,Id:${tenantId}`,
            );
            try {
                const tenant = yield this.tenantService.getOne(
                    Number(tenantId),
                );
                if (!tenant) {
                    next(
                        (0, http_errors_1.default)(
                            400,
                            "Tenant does not exist.",
                        ),
                    );
                    return;
                }
                this.logger.info(`successfully get tenant,Id:${tenantId}`);
                res.json(tenant);
            } catch (error) {
                next(error);
                return;
            }
        });
    }
    // Method to delete a tenant by id
    deleteById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                res.status(400).json({ errors: result.array });
            }
            const tenantId = req.params.id;
            if (isNaN(Number(tenantId))) {
                next(
                    (0, http_errors_1.default)(400, "Inavalid url paramater."),
                );
                return;
            }
            try {
                yield this.tenantService.deleteById(Number(tenantId));
                this.logger.info(`Tenant has been deleted,Id:${tenantId}`);
                res.json({ id: Number(tenantId) });
            } catch (error) {
                next(error);
            }
        });
    }
}
exports.default = TenantController;
