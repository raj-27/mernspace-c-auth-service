import "reflect-metadata";
import { DataSource } from "typeorm";
import { Config } from ".";
import { RefreshToken, Tenant, User } from "../entity";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: Config.DB_HOST,
    port: Number(Config.DB_PORT),
    username: Config.DB_USER,
    password: Config.DB_PASS,
    database: Config.DB_NAME,
    // Always set false
    synchronize: false,
    logging: false,
    entities: [User, RefreshToken, Tenant],
    migrations: ["src/migration/*.ts"],
    subscribers: [],
});
