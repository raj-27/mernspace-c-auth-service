"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDiscount = void 0;
const calculateDiscount = (price, percentage) => {
    return price * (percentage / 100);
};
exports.calculateDiscount = calculateDiscount;
