import app from "./app";
import { Config } from "./config";
import { AppDataSource } from "./config/data-source";
import logger from "./config/logger";

const startServer = async () => {
    try {
        await AppDataSource.initialize();
        logger.info("Database Conneced Successfuly!");
        app.listen(Config.PORT, () =>
            logger.info(`listening on port ${Config.PORT}`),
        );
    } catch (err) {
        if (err instanceof Error) {
            logger.error(err?.message);
            setTimeout(() => {
                process.exit();
            }, 1000);
        }
    }
};

void startServer();
