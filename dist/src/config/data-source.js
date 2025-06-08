"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const _1 = require(".");
const entity_1 = require("../entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: _1.Config.DB_HOST,
    port: Number(_1.Config.DB_PORT),
    username: _1.Config.DB_USERNAME,
    password: _1.Config.DB_PASSWORD,
    database: _1.Config.DB_NAME,
    // Always set false
    synchronize: false,
    logging: false,
    entities: [entity_1.User, entity_1.RefreshToken, entity_1.Tenant],
    migrations: ["src/migration/*.ts"],
    subscribers: [],
});
