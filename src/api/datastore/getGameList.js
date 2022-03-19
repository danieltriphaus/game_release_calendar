import { Datastore } from "@google-cloud/datastore";

export const getGameList = async (userId) => {
    const datastore = new Datastore();
    const key = datastore.key(["user", userId, "game_list", "default"]);

    const [gameList] = await datastore.get(key);
    return gameList;
};
