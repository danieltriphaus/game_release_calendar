import { Logging } from "@google-cloud/logging";

export const writeLog = async ({ logName, message, severity, request }) => {
    const logging = new Logging({ projectId: process.env.GOOGLE_CLOUD_PROJECT });
    const log = logging.logSync(logName);

    const entry = log.entry({
        httpRequest: request,
        resource: {
            type: "gae_app",
            labels: {
                module_id: process.env.GAE_SERVICE,
                project_id: process.env.GOOGLE_CLOUD_PROJECT,
                version_id: process.env.GAE_VERSION,
            },
        },
        severity,
    }, { message: message, headers: request.headers });

    await log.write(entry);
};

export const logError = async (error, request) => {
    await writeLog({
        logName: "error",
        severity: "ERROR",
        request,
        message: JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))),
    });
};