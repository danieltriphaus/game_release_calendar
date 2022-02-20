import { OpenAPIBackend } from "openapi-backend";

import { postAccess } from "../handlers/postAccess.js";

const api = new OpenAPIBackend({
    definition: "src/api/schema/GameReleaseCalendar.json",
    handlers: {
        "post-access": postAccess,
    },
});

api.init();

export function apiBackend() {
    return (req, res) => api.handleRequest(req, req, res);
}
