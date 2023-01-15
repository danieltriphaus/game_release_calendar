import { Datastore } from "@google-cloud/datastore";
/**
 * @module datastore/upsertGameList
 */

/**
 * @async
 * @param {UserID} userId
 * @param {GameListEntry[]} games
 * @param {GameListID} listId
 */
export async function upsertGameList(userId, games, listId) {
    const datastore = new Datastore();

    const gameListEntity = {
        key: datastore.key(userId ? ["user", userId, "game_list", listId] : ["game_list", listId]),
        data: {
            games,
        },
    };

    await datastore.upsert(gameListEntity);
}
