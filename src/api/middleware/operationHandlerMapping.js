import { postUserCalendar } from "../handlers/userCalendar/postUserCalendar.js";
import { getUserCalendar } from "../handlers/userCalendar/getUserCalendar.js";
import { getUserCalendars } from "../handlers/userCalendar/getUserCalendars.js";

import { postUserGames } from "../handlers/userGames/postUserGames.js";
import { getUserGames } from "../handlers/userGames/getUserGames.js";
import { deleteUserGames } from "../handlers/userGames/deleteUserGames.js";

import { deleteAccess } from "../handlers/deleteAccess.js";
import { getGameSearch } from "../handlers/getGameSearch.js";
import { postGame } from "../handlers/postGame.js";
import { postUserGLogin } from "../handlers/postUserGLogin.js";

export const operationHandlerMapping = {
    "get-game-search": getGameSearch,
    "post-game": postGame,
    "post-user-games": postUserGames,
    "get-user-games": getUserGames,
    "delete-user-games": deleteUserGames,
    "get-user-calendar": getUserCalendar,
    "post-user-calendar": postUserCalendar,
    "get-user-calendars": getUserCalendars,
    "post-user-g-login": postUserGLogin,
    "delete-access": deleteAccess,
};
