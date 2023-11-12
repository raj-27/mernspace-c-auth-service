/* eslint-disable no-console */
import app from "./app";
import { Config } from "./config";

const startServer = () => {
    try {
        app.listen(Config.PORT, () =>
            console.log(`listening on port ${Config.PORT}`),
        );
    } catch (error) {
        console.error(error);
        process.exit();
    }
};

startServer();
