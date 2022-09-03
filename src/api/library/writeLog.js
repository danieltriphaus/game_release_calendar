import { Logging } from "@google-cloud/logging";

export const writeLog = async ({ logName, message, severity, request, additionalData }) => {
    const logging = new Logging({ projectId: process.env.GOOGLE_CLOUD_PROJECT });
    const log = logging.log(logName);

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
    }, { message: message, headers: request.headers, ...additionalData });

    await log.write(entry);
};

export const logError = async (error, request) => {
    let additionalData;
    if (error.request) {
        additionalData = getExternalRequestData(error);
    }
    await writeLog({
        logName: "error",
        severity: "ERROR",
        request,
        message: JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))),
        additionalData,
    });
};

function getExternalRequestData(error) {
    return {
        externalRequest: {
            url: error.config.url,
            method: error.config.method,
            headers: error.config.headers,
            data: error.config.data,
        },
        externalResponse: error.response.data ? error.response.data : undefined,
    };
}
