import { getGameList } from "../datastore/getGameList.js";
import { getGamesById } from "../igdb/getGamesById.js";
import { displayFields } from "../igdb/gamesFieldLists.js";
import { getIgdbAccessToken } from "../igdb/igdbAccessToken.js";

export const getUserGames = async (context, req, res) => {
    const accessToken = (await getIgdbAccessToken()).access_token;
    const gameList = await getGameList(context.request.params.user_id);
    if (gameList) {
        const games = await getGamesById(gameList.games, accessToken, displayFields);
        res.status(200).json(games);
    } else {
        res.status(404).json({
            error: "not_found",
            message: "gameList not found",
        });
    }
};
