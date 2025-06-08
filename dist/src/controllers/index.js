"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = exports.TenantController = exports.AuthController = void 0;
var AuthController_1 = require("./AuthController");
Object.defineProperty(exports, "AuthController", { enumerable: true, get: function () { return __importDefault(AuthController_1).default; } });
var TenantController_1 = require("./TenantController");
Object.defineProperty(exports, "TenantController", { enumerable: true, get: function () { return __importDefault(TenantController_1).default; } });
var UserController_1 = require("./UserController");
Object.defineProperty(exports, "UserController", { enumerable: true, get: function () { return __importDefault(UserController_1).default; } });
