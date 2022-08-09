import { spawn } from "child_process";
import axios from "axios";
import { config } from "dotenv";
import { rename, rm } from "fs/promises";
import { exit } from "process";

config();

(async () => {
    const cmdArguments = {
        buildForDevelopment: process.argv.some((arg) => arg === "--dev"),
    };

    if (cmdArguments.buildForDevelopment) {
        process.env.NODE_ENV = "development";
    } else {
        process.env.NODE_ENV = "production";
    }

    await spawnAsync("vite", ["build"], { stdio: "inherit" });

    try {
        await rm("src/api/views", { recursive: true, force: true });
        await rename("dist", "src/api/views");
    } catch (error) {
        console.error(error);
    }


    if (!(await isAppStarted())) {
        console.log("App not running attempting to start");
        await startApp();
        console.log("App started");
    }

    if (await isAppStarted) {
        console.log("App running");
        await spawnAsync("yarn", ["test:cypress"], { stdio: "inherit" });
    }

    exit();
})();

async function isAppStarted() {
    const response = await axios.get("http://localhost:" + process.env.PORT + "/", { headers: { accept: "text/html" } })
        .catch((error) => {
            if (!error.response) {
                return false;
            } else {
                throw error;
            }
        });

    if (response.status === 200) {
        return true;
    }
}

async function startApp() {
    return new Promise((resolve) => {
        const devServerChildProcess = spawn("yarn", ["start"]);
        devServerChildProcess.stdout.on("data", (data) => {
            const message = data.toString();
            if (message.match("Listening on port " + process.env.PORT)) {
                resolve(true);
            }
        });
    });
}

async function spawnAsync(cmd, args, options) {
    return new Promise((resolve) => {
        const buildProcess = spawn(cmd, args, options);
        buildProcess.on("exit", () => {
            resolve();
        });
    });
}