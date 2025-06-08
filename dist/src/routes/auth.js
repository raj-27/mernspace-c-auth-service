"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_source_1 = require("../config/data-source");
const logger_1 = __importDefault(require("../config/logger"));
const middlewares_1 = require("../middlewares");
const service_1 = require("../service");
const validators_1 = require("../validators");
const controllers_1 = require("../controllers");
const entity_1 = require("../entity");
const router = express_1.default.Router();
const userRepository = data_source_1.AppDataSource.getRepository(entity_1.User);
const userService = new service_1.UserService(userRepository);
const refreshTokenRepository = data_source_1.AppDataSource.getRepository(
    entity_1.RefreshToken,
);
const tokenService = new service_1.TokenService(refreshTokenRepository);
const credentialService = new service_1.CredentialService();
const authController = new controllers_1.AuthController(
    userService,
    logger_1.default,
    tokenService,
    credentialService,
);
router.post("/register", validators_1.registerValidator, (req, res, next) =>
    authController.register(req, res, next),
);
router.post("/login", validators_1.loginValidator, (req, res, next) =>
    authController.login(req, res, next),
);
router.get("/self", middlewares_1.authenticate, (req, res) =>
    authController.self(req, res),
);
router.post("/refresh", middlewares_1.validateRefreshToken, (req, res, next) =>
    authController.refresh(req, res, next),
);
router.post(
    "/logout",
    middlewares_1.authenticate,
    middlewares_1.parseRefreshToken,
    (req, res, next) => authController.logout(req, res, next),
);
exports.default = router;
