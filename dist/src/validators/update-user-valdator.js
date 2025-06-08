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
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
exports.default = (0, express_validator_1.checkSchema)({
    firstName: {
        trim: true,
        notEmpty: true,
        errorMessage: "firstName is required",
    },
    lastName: {
        trim: true,
        notEmpty: true,
        errorMessage: "lastName is required",
    },
    email: {
        trim: true,
        notEmpty: true,
        errorMessage: "Email is required",
    },
    role: {
        notEmpty: true,
        errorMessage: "Role is Required",
    },
    tenantId: {
        errorMessage: "Tenant id is required",
        custom: {
            options: (value, { req }) =>
                __awaiter(void 0, void 0, void 0, function* () {
                    const role = req.body.body.role;
                    if (role === "admin") {
                        return false;
                    } else {
                        return !!value;
                    }
                }),
        },
    },
});
