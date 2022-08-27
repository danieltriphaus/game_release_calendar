import { Datastore } from "@google-cloud/datastore";
import { chunkArray } from "../library/chunkArray.js";

export const getGameList = async (userId) => {
    const datastore = new Datastore();
    const key = datastore.key(["user", userId, "game_list", "default"]);

    const [gameList] = await datastore.get(key);
    return gameList;
};

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
