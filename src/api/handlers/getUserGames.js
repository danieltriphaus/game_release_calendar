import { getGameList } from "../datastore/getGameList.js";
import { getGamesData } from "../library/getGamesData.js";
import { displayFields } from "../igdb/gamesFieldLists.js";

export const getUserGames = async (context, req, res) => {
    const gameList = await getGameList(context.request.params.user_id);

    if (gameList) {
        const games = await getGamesData(gameList.games, displayFields);
        res.status(200).json(games);
    } else {
        res.status(404).json({
            error: "not_found",
            message: "gameList not found",
        });
    }
};
