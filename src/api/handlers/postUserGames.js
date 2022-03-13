import { Datastore } from "@google-cloud/datastore";

export const postUserGames = async (context, req, res) => {
    const datastore = new Datastore();
    const userId = context.request.params.user_id;
    const gameEntities = [];

    req.body.forEach((gameId) => {
        gameEntities.push({
            key: datastore.key(["user", userId, "game", gameId]),
            data: {},
        });
    });

    await datastore.upsert(gameEntities);

    res.status(200);
    res.end();
};
