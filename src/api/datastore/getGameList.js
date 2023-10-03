import { Datastore } from "@google-cloud/datastore";
/**
 * @module datastore/getGameList
 */

/**
 * get a users default game list
 * @async
 * @param {UserID} userId
 * @param {string} [listId="default"]
 * @returns {Promise<Array>}
 */
export const getGameList = async (userId, listId = "default") => {
    const datastore = new Datastore();
    const key = datastore.key(["user", userId, "game_list", listId]);

    const [gameList] = await datastore.get(key);
    return gameList;
};

/**
 * Get game lists which contain a specific game id
 * @async

 * @param {UserID} userId
 * @returns {Promise<Array>}
 */
export const getAllGameLists = async (userId) => {
    const datastore = new Datastore();

    const query = datastore.createQuery("game_list").select("__key__");
    if (userId) {
        query.hasAncestor(datastore.key(["user", userId]));
    }
    const [gameLists] = await datastore.runQuery(query);

    return gameLists;
};
