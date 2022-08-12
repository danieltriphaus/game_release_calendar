import { OpenAPIBackend } from "openapi-backend";

import { operationHandlerMapping } from "./operationHandlerMapping.js";
import { userAuth, calendarToken, gaeCron } from "./securityHandlers.js";

const api = new OpenAPIBackend({
    definition: "src/api/schema/GameReleaseCalendar.json",
    handlers: {
        ...operationHandlerMapping,
        "get-access": (context, req, res) => {
            // eslint-disable-next-line no-unused-vars
            const { auth_key, ...publicUserData } = context.security.userAuth;
            res.status(200).json(publicUserData);
        },
        notFound: (context, req, res) => {
            res.status(404).json("API Route not found");
        },
        notImplemented: (context, req, res) => {
            res.status(501).json("API Route Handler not implemented");
        },
        unauthorizedHandler: (context, req, res) => {
            res.status(401).json({ error: "not_authorized", message: "invalid API Key" });
        },
    },
});

api.registerSecurityHandler("userAuth", userAuth);
api.registerSecurityHandler("token", calendarToken);
api.registerSecurityHandler("GAE_Cron", gaeCron);

api.init();

export function apiBackend() {
    return (req, res) => api.handleRequest(req, req, res);
}
