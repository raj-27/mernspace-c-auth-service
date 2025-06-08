"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserValidator =
    exports.listTenantValidator =
    exports.tenantValidator =
    exports.registerValidator =
    exports.loginValidator =
        void 0;
var login_validator_1 = require("./login-validator");
Object.defineProperty(exports, "loginValidator", {
    enumerable: true,
    get: function () {
        return __importDefault(login_validator_1).default;
    },
});
var register_validator_1 = require("./register-validator");
Object.defineProperty(exports, "registerValidator", {
    enumerable: true,
    get: function () {
        return __importDefault(register_validator_1).default;
    },
});
var tenantValidator_1 = require("./tenantValidator");
Object.defineProperty(exports, "tenantValidator", {
    enumerable: true,
    get: function () {
        return __importDefault(tenantValidator_1).default;
    },
});
var list_tenant_validator_1 = require("./list-tenant-validator");
Object.defineProperty(exports, "listTenantValidator", {
    enumerable: true,
    get: function () {
        return __importDefault(list_tenant_validator_1).default;
    },
});
var update_user_valdator_1 = require("./update-user-valdator");
Object.defineProperty(exports, "updateUserValidator", {
    enumerable: true,
    get: function () {
        return __importDefault(update_user_valdator_1).default;
    },
});
