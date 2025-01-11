import { getIgdbAccessToken } from "../igdb/igdbAccessToken.js";
import { displayFields } from "../igdb/gamesFieldLists.js";
import { searchGames } from "../igdb/searchGames.js";
import { getGameList } from "../datastore/getGameList.js";

export const getGameSearch = async (context, req, res) => {
    
    const accessToken = (await getIgdbAccessToken()).access_token;

    const [results, gameList] = await  Promise.all([searchGames(req.query.q, accessToken, displayFields), getGameList(req.user.id)])
    
    for (const game of gameList.games) {
        //using == here because of the edge case where id is a number saved as a string and we need to distinguish it from the string ids of temporary games
        const gameOnList = results.find((result) => game.id == result.id);
        gameOnList ? gameOnList.isOnList = true : undefined;
    }

    res.status(200).json(results);
};
