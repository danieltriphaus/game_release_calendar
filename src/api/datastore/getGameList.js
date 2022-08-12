import { Datastore } from "@google-cloud/datastore";
import { chunkArray } from "../library/chunkArray.js";

export const getGameList = async (userId) => {
    const datastore = new Datastore();
    const key = datastore.key(["user", userId, "game_list", "default"]);

    const [gameList] = await datastore.get(key);
    return gameList;
};

export const getGameListsContainingGameIds = async (gameIds) => {
    const datastore = new Datastore();

    const gameIdChunks = chunkArray(gameIds, 10);

    const result = gameIdChunks.map(async (gameIdChunk) => {
        const query = datastore.createQuery("game_list").filter("games", "IN", gameIdChunk);
        return await datastore.runQuery(query);
    });
    const [gameLists] = await Promise.all(result);

    return gameLists[0];
};
