import { Datastore } from "@google-cloud/datastore";
/**
 * @module datastore/upsertGame
 */

/**
 * @async
 * @param {*} gameData
 */
export const upsertGame = async (gameData) => {
    const datastore = new Datastore();

    const { id, ...gameFields } = gameData;

    const game = {
        key: datastore.key(["game", id]),
        data: gameFields,
    };

    await datastore.upsert(game);
};
