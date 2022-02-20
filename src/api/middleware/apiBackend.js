import { OpenAPIBackend } from "openapi-backend";

import { postAccess } from "../handlers/postAccess.js";

const api = new OpenAPIBackend({
    definition: "src/api/schema/GameReleaseCalendar.json",
    handlers: {
        "post-access": postAccess,
        notFound: (context, req, res) => {
            res.status(404).json("API Route not found");
        },
        notImplemented: (context, req, res) => {
            res.status(501).json("API Route Handler not implemented");
        },
    },
});

api.init();

export function apiBackend() {
    return (req, res) => api.handleRequest(req, req, res);
}
