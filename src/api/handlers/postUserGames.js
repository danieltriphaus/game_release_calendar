import { Datastore } from "@google-cloud/datastore";
import { getGameList } from "../datastore/getGameList.js";

//ToDo: write test
export const postUserGames = async (context, req, res) => {
    const datastore = new Datastore();
    const userId = context.request.params.user_id;

    const gameList = await getGameList(userId);

    const games = req.body;

    if (gameList) {
        games.push(...gameList.games);
    }

    const gameListEntity = {
        key: datastore.key(["user", userId, "game_list", "default"]),
        data: {
            games,
        },
    };

    await datastore.upsert(gameListEntity);

    res.status(200);
    res.end();
};
