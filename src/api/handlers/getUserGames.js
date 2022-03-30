import { getGameList } from "../datastore/getGameList.js";
import { getGamesById } from "../igdb/getGamesById.js";
import { displayFields } from "../igdb/gamesFieldLists.js";

export const getUserGames = async (context, req, res) => {
    const gameList = await getGameList(context.request.params.user_id);
    const games = await getGamesById(gameList.games, req.cookies.igdb_access_token, displayFields);

    res.status(200).json(games);
};
