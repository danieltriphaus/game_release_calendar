import { Datastore } from "@google-cloud/datastore";
import { chunkArray } from "../library/chunkArray.js";
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
export const getGameList = async (userId, listId) => {
    if (!listId) {
        listId = "default";
    }

    const datastore = new Datastore();
    const key = datastore.key(["user", userId, "game_list", listId]);

    const [gameList] = await datastore.get(key);
    return gameList;
};

/**
 * @param {any} entity
 * @returns
 */
export const getKeyFromDatastoreEntity = (entity) => {
    const key = entity[Datastore.KEY];
    if (!key.parent) {
        return { id: key.id ? key.id : key.name };
    } else {
        return {
            id: key.id ? key.id : key.name,
            parent: key.parent.id ? key.parent.id : key.parent.name,
        };
    }
};

/**
 * Get game lists which contain a specific game id
 * @async
 * @param {GameID[]} gameIds
 * @param {UserID} userId
 * @returns {Promise<Array>}
 */
export const getGameListsContainingGameIds = async (gameIds, userId) => {
    const datastore = new Datastore();

    const gameIdChunks = chunkArray(gameIds, 10);

    const result = gameIdChunks.map(async (gameIdChunk) => {
        const query = datastore.createQuery("game_list")
            .select()
            .filter("games", "IN", gameIdChunk);
        if (userId) {
            query.hasAncestor(datastore.key(["user", userId]));
        }
        return await datastore.runQuery(query);
    });
    const [gameLists] = await Promise.all(result);

    return gameLists[0];
};
