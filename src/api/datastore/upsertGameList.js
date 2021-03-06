import { Datastore } from "@google-cloud/datastore";

export async function upsertGameList(userId, games, listId) {
    const datastore = new Datastore();

    const gameListEntity = {
        key: datastore.key(["user", userId, "game_list", listId]),
        data: {
            games,
        },
    };

    await datastore.upsert(gameListEntity);
}
