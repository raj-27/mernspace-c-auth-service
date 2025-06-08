"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
exports.default = (0, express_validator_1.checkSchema)({
    email: {
        errorMessage: "Email is required",
        notEmpty: true,
        trim: true,
    },
    password: {
        errorMessage: "Password is required",
        notEmpty: true,
    },
});
