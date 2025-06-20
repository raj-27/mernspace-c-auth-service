"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const constants_1 = require("../constants");
const service_1 = require("../service");
const data_source_1 = require("../config/data-source");
const entity_1 = require("../entity");
const list_users_validator_1 = __importDefault(
    require("../validators/list-users-validator"),
);
const validators_1 = require("../validators");
const router = express_1.default.Router();
const userRepository = data_source_1.AppDataSource.getRepository(entity_1.User);
const userService = new service_1.UserService(userRepository);
const userController = new controllers_1.UserController(userService);
router.post(
    "/",
    middlewares_1.authenticate,
    (0, middlewares_1.canAccess)([constants_1.Roles.ADMIN]),
    (req, res, next) => userController.create(req, res, next),
);
router.patch(
    "/:id",
    middlewares_1.authenticate,
    (0, middlewares_1.canAccess)([constants_1.Roles.ADMIN]),
    validators_1.updateUserValidator,
    (req, res, next) => userController.update(req, res, next),
);
router.get(
    "/",
    middlewares_1.authenticate,
    (0, middlewares_1.canAccess)([constants_1.Roles.ADMIN]),
    list_users_validator_1.default,
    (req, res, next) => userController.getAll(req, res, next),
);
exports.default = router;
