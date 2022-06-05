import { getIgdbAccessToken } from "../igdb/igdbAccessToken.js";
import { getGamesById } from "../igdb/getGamesById.js";
import { getTemporaryGames, convertFromDatastoreResult } from "../datastore/getTemporaryGames.js";

export const getGamesData = async (gameIds, fields) => {
    const accessToken = (await getIgdbAccessToken()).access_token;

    const temporaryGameIds = gameIds.filter((gameId) => {
        return typeof gameId === "string";
    });

    const igdbGameIds = gameIds.filter((gameId) => {
        return typeof gameId === "number";
    });

    const [igdbGames, temporaryGamesDatastoreResult] = await Promise.all([
        getGamesById(igdbGameIds, accessToken, fields),
        getTemporaryGames(temporaryGameIds),
    ]);

    const temporaryGames = convertFromDatastoreResult(temporaryGamesDatastoreResult);
    return [...igdbGames, ...temporaryGames];
};
