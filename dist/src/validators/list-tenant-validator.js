"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const utils_1 = require("../../tests/utils");
exports.default = (0, express_validator_1.checkSchema)({
    q: (0, utils_1.qSanitize)(),
    currentPage: (0, utils_1.currentPageSanitize)(),
    perPage: (0, utils_1.perPageSanitize)(),
}, ["query"]);
