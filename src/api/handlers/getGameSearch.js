import { getIgdbAccessToken } from "../igdb/igdbAccessToken.js";
import { displayFields } from "../igdb/gamesFieldLists.js";
import { searchGames } from "../igdb/searchGames.js";

export const getGameSearch = async (context, req, res) => {
    const accessToken = (await getIgdbAccessToken()).access_token;

    const result = await searchGames(req.query.q, accessToken, displayFields);

    res.status(200).json(result);
};
