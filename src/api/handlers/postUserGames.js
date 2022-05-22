import { getGameList } from "../datastore/getGameList.js";
import { upsertGameList } from "../datastore/upsertGameList.js";

export const postUserGames = async (context, req, res) => {
    const userId = context.request.params.user_id;

    const gameList = await getGameList(userId);

    const games = req.body;

    if (gameList) {
        games.push(...gameList.games);
    }

    await upsertGameList(userId, games, "default");

    res.status(200);
    res.end();
};
