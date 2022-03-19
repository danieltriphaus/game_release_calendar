import { Datastore } from "@google-cloud/datastore";
import { getGameList } from "../datastore/getGameList.js";

export const postUserGames = async (context, req, res) => {
    const datastore = new Datastore();
    const userId = context.request.params.user_id;

    const gameList = await getGameList(userId);

    const gameListEntity = {
        key: datastore.key(["user", userId, "game_list", "default"]),
        data: {
            games: [...gameList.games, ...req.body],
        },
    };

    await datastore.upsert(gameListEntity);

    res.status(200);
    res.end();
};
