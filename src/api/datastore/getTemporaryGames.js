import { Datastore } from "@google-cloud/datastore";
/**
 * @module datastore/getTemporaryGames
 */

/**
 * Get Temporary Games
 * @async
 * @param {TemporaryGameID[]} gameIds
 * @returns {Promise<Array>}
 */
export const getTemporaryGames = async (gameIds) => {
    const datastore = new Datastore();

    const keys = gameIds.map((gameId) => {
        return datastore.key(["game", gameId]);
    });

    if (keys.length > 0) {
        const [games] = await datastore.get(keys);
        return games;
    }
};

/**
 * Get all Temporary Games
 * @async
 * @returns {Promise<Array>}
 */
export const getAllTemporaryGames = async () => {
    const datastore = new Datastore();

    // @ts-ignore
    const query = datastore.createQuery("game").filter("matched", "=", null);

    const [games] = await datastore.runQuery(query);
    return games;
};
