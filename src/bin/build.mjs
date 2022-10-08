import { spawn } from "child_process";
import axios from "axios";
import { config } from "dotenv";
import { rename, rm } from "node:fs/promises";
import { exit } from "process";

config();

(async () => {
    const progress = {
        isViteBuildComplete: false,
        hasMovedDistDir: false,
        hasRunTests: false,
    };

    const cmdArguments = {
        buildForDevelopment: process.argv.some((arg) => arg === "--dev"),
        noCypressTests: process.argv.some((arg) => arg === "--no-cypress"),
    };

    if (cmdArguments.buildForDevelopment) {
        process.env.NODE_ENV = "development";
    } else {
        process.env.NODE_ENV = "production";
    }

    try {
        await spawnAsync("vite", ["build"], { stdio: "inherit" });
        progress.isViteBuildComplete = true;

        await rm("src/api/views", { recursive: true, force: true });
        await rename("dist", "src/api/views");
        progress.hasMovedDistDir = true;

        if (!(await isAppStarted())) {
            console.log("App not running attempting to start");
            await startApp();
            console.log("App started");
        }

        if (await isAppStarted && !cmdArguments.noCypressTests) {
            console.log("App running");
            await spawnAsync("yarn", ["test:cypress"], { stdio: "inherit" });
            progress.hasRunTests = true;
        }

    } catch (error) {
        console.error(error);
    }

    if (progress.isViteBuildComplete) {
        console.log("Frontend was built to dist/");
    } else {
        console.log("Frontend could not be built");
    }

    if (progress.hasMovedDistDir) {
        console.log("dist/ was moved to src/api/views/");
    } else {
        console.log("dist/ could not be moved");
    }

    if (cmdArguments.noCypressTests) {
        console.log("No Tests were run");
    } else if (progress.hasRunTests) {
        console.log("All Tests succeeded");
    } else {
        console.log("Tests failed");
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
    return new Promise((resolve, reject) => {
        const buildProcess = spawn(cmd, args, options);
        buildProcess.on("exit", (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(code);
            }
        });
    });
}