import { exec } from "child_process";
import { promisify } from "util";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({
    path: join(__dirname, "../.env.migration"),
});

async function runMigration() {
    try {
        const { stdout, stderr } = await execAsync(
            "set NODE_ENV=migration && npm run migration:run -- -d src/config/data-source.ts"
        );

        if (stdout) {
            console.log("Migration Output:");
            console.log(stdout);
        }

        if (stderr) {
            console.error("Migration Error Output:");
            console.error(stderr);
        }
    } catch (error) {
        console.error("Failed to run migration:");
        console.error(error.message);
        process.exit(1);
    }
}

runMigration();