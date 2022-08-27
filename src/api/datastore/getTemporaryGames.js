import { Datastore } from "@google-cloud/datastore";

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

export const getAllTemporaryGames = async () => {
    const datastore = new Datastore();

    const query = datastore.createQuery("game").filter("matched", "=", null);

    const [games] = await datastore.runQuery(query);
    return games;
};

export const convertFromDatastoreResult = (result) => {
    if (result) {
        return result
            ? result.map((datastoreResult) => {
                return { id: datastoreResult[Datastore.KEY].name, name: datastoreResult.name };
            })
            : [];
    }
};
