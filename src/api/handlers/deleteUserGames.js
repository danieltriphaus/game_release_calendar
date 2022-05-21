import { upsertGameList } from "../datastore/upsertGameList.js";
import { getGameList } from "../datastore/getGameList.js";

export const deleteUserGames = async (context, req, res) => {
    const userId = context.request.params.user_id;

    const gameList = await getGameList(userId);

    req.body.forEach((gameId) => {
        const deleteIndex = gameList.games.indexOf(parseInt(gameId));
        gameList.games.splice(deleteIndex, 1);
    });

    await upsertGameList(userId, gameList.games, "default");

    res.status(200).end();
};
