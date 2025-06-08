"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
function canAccess(roles) {
    return (req, res, next) => {
        const _req = req;
        const fromToken = _req.auth.role;
        if (!roles.includes(fromToken)) {
            const error = (0, http_errors_1.default)(
                403,
                "You dont have enough permission",
            );
            next(error);
            return;
        }
        next();
    };
}
exports.default = canAccess;
