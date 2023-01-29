import { upsertGameList } from "../../datastore/upsertGameList.js";
import { getGameList } from "../../datastore/getGameList.js";

//ToDo: Add validation
export const deleteUserGames = async (context, req, res) => {
    const userId = context.request.params.user_id;

    const gameList = await getGameList(userId, req.body.listId ? req.body.listId : "default");

    const games = req.body.games;

    games.forEach((gameForDelete) => {
        const deleteIndex = gameList.games.findIndex((game) => game.id === gameForDelete.id);
        gameList.games.splice(deleteIndex, 1);
    });

    await upsertGameList(userId, gameList.games, "default");

    res.status(200).end();
};
