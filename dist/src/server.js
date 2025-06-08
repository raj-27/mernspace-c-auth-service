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
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const data_source_1 = require("./config/data-source");
const logger_1 = __importDefault(require("./config/logger"));
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield data_source_1.AppDataSource.initialize().then(() => logger_1.default.info("Database Conneced Successfuly!"));
        app_1.default.listen(config_1.Config.PORT, () => logger_1.default.info(`listening on port ${config_1.Config.PORT}`));
    }
    catch (err) {
        if (err instanceof Error) {
            logger_1.default.error(err === null || err === void 0 ? void 0 : err.message);
            setTimeout(() => {
                process.exit();
            }, 1000);
        }
    }
});
void startServer();
