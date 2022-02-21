import { OpenAPIBackend } from "openapi-backend";

import { postAccess } from "../handlers/postAccess.js";
import { getGame } from "../handlers/getGame.js";

const api = new OpenAPIBackend({
    definition: "src/api/schema/GameReleaseCalendar.json",
    handlers: {
        "post-access": postAccess,
        "get-game": getGame,
        notFound: (context, req, res) => {
            res.status(404).json("API Route not found");
        },
        notImplemented: (context, req, res) => {
            res.status(501).json("API Route Handler not implemented");
        },
    },
});

api.registerSecurityHandler("apiKey", (context, req) => {
    return req.cookies.api_key !== process.env.API_KEY;
});

api.init();

export function apiBackend() {
    return (req, res) => api.handleRequest(req, req, res);
}
