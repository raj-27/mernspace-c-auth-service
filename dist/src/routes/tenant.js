"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const service_1 = require("../service");
const data_source_1 = require("../config/data-source");
const entity_1 = require("../entity");
const middlewares_1 = require("../middlewares");
const constants_1 = require("../constants");
const validators_1 = require("../validators");
const logger_1 = __importDefault(require("../config/logger"));
const router = express_1.default.Router();
const tenantRepository = data_source_1.AppDataSource.getRepository(
    entity_1.Tenant,
);
const tenantService = new service_1.TenantService(tenantRepository);
const tenantController = new controllers_1.TenantController(
    tenantService,
    logger_1.default,
);
router.post(
    "/",
    middlewares_1.authenticate,
    (0, middlewares_1.canAccess)([constants_1.Roles.ADMIN]),
    (req, res, next) => tenantController.create(req, res, next),
);
router.patch(
    "/:id",
    middlewares_1.authenticate,
    (0, middlewares_1.canAccess)([constants_1.Roles.ADMIN]),
    validators_1.tenantValidator,
    (req, res, next) => tenantController.update(req, res, next),
);
router.get(
    "/",
    middlewares_1.authenticate,
    (0, middlewares_1.canAccess)([constants_1.Roles.ADMIN]),
    validators_1.listTenantValidator,
    (req, res, next) => tenantController.getAll(req, res, next),
);
router.get(
    "/:id",
    middlewares_1.authenticate,
    (0, middlewares_1.canAccess)([constants_1.Roles.ADMIN]),
    (req, res, next) => tenantController.getOne(req, res, next),
);
router.delete(
    "/:id",
    middlewares_1.authenticate,
    (0, middlewares_1.canAccess)([constants_1.Roles.ADMIN]),
    (req, res, next) => tenantController.deleteById(req, res, next),
);
exports.default = router;
