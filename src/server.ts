import app from "./app";
import { Config } from "./config";
import logger from "./config/logger";

const startServer = () => {
    try {
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

startServer();
