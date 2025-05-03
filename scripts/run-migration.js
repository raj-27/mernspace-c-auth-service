import { exec } from "child_process";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    path: join(__dirname, `../.env.migration`),
});

function runMigration() {
    exec(
        "set NODE_ENV=migration && npm run migration:run -- -d src/config/data-source.ts",
        (error, stdout, stderr) => {
            if (error) return;
            if (stderr) return;
        },
    );
}

runMigration();
