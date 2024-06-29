import "reflect-metadata";
import { DataSource } from "typeorm";
import { Config } from ".";
import { RefreshToken, User } from "../entity";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: Config.DB_HOST,
    port: Number(Config.DB_HOST),
    username: Config.DB_USERNAME,
    password: Config.DB_PASSWORD,
    database: Config.DB_NAME,
    // Always set false
    synchronize: false,
    logging: false,
    entities: [User, RefreshToken],
    migrations: ["src/migration/*.ts"],
    subscribers: [],
});
