"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const tenant_1 = __importDefault(require("./routes/tenant"));
const user_1 = __importDefault(require("./routes/user"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const middlewares_1 = require("./middlewares");
const app = (0, express_1.default)();
app.use(express_1.default.static("public"));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
}));
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Welcome to auth service");
}));
app.use("/auth", auth_1.default);
app.use("/tenants", tenant_1.default);
app.use("/users", user_1.default);
app.use(middlewares_1.globalErrorHandler);
exports.default = app;
