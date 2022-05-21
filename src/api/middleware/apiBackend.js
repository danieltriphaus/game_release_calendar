import { OpenAPIBackend } from "openapi-backend";

import { getGame } from "../handlers/getGame.js";
import { getGameSearch } from "../handlers/getGameSearch.js";
import { postUserGames } from "../handlers/postUserGames.js";
import { postUserCalendar } from "../handlers/postUserCalendar.js";
import { getUserCalendar } from "../handlers/getUserCalendar.js";
import { getUserCalendars } from "../handlers/getUserCalendars.js";
import { getUserGames } from "../handlers/getUserGames.js";
import { postUserGLogin } from "../handlers/postUserGLogin.js";
import { deleteAccess } from "../handlers/deleteAccess.js";

import { getCalendar } from "../datastore/getCalendar.js";
import { getUserByAuthKey } from "../datastore/getUser.js";

const api = new OpenAPIBackend({
    definition: "src/api/schema/GameReleaseCalendar.json",
    handlers: {
        "get-game-search": getGameSearch,
        "get-game": getGame,
        "post-user-games": postUserGames,
        "get-user-games": getUserGames,
        "get-user-calendar": getUserCalendar,
        "post-user-calendar": postUserCalendar,
        "get-user-calendars": getUserCalendars,
        "post-user-g-login": postUserGLogin,
        "delete-access": deleteAccess,
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

api.registerSecurityHandler("userAuth", async (context, req) => {
    const user = await getUserByAuthKey(req.cookies.auth_key);
    if (context.request.params.user_id && context.request.params.user_id === user.id) {
        return user;
    }
    if (!context.request.params.user_id && user) {
        return user;
    }
});

api.registerSecurityHandler("token", async (context) => {
    const calendar = await getCalendar(context.request.params.user_id, context.request.query.token);
    return calendar;
});

api.init();

export function apiBackend() {
    return (req, res) => api.handleRequest(req, req, res);
}
