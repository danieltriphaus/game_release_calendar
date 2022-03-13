import { OpenAPIBackend } from "openapi-backend";

import { postAccess } from "../handlers/postAccess.js";
import { getGame } from "../handlers/getGame.js";
import { getGameSearch } from "../handlers/getGameSearch.js";
import { postUserGames } from "../handlers/postUserGames.js";

const api = new OpenAPIBackend({
    definition: "src/api/schema/GameReleaseCalendar.json",
    handlers: {
        "get-game-search": getGameSearch,
        "post-access": postAccess,
        "get-game": getGame,
        "post-user-games": postUserGames,
        "get-access": (context, req, res) => {
            res.status(200).end();
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

api.registerSecurityHandler("apiKey", (context, req) => {
    return req.cookies.api_key === process.env.API_KEY;
});

api.init();

export function apiBackend() {
    return (req, res) => api.handleRequest(req, req, res);
}
