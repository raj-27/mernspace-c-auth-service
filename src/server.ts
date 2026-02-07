import app from "./app";
import { Config } from "./config";
import { AppDataSource } from "./config/data-source";
import logger from "./config/logger";

const startServer = async () => {
    try {
        await AppDataSource.initialize().then(() =>
            logger.info("Database Conneced Successfuly!"),
        );
        const port = Config.PORT || 5501;
        app.listen(port, () => logger.info(`listening on port ${port}`));
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
