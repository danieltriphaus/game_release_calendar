import { getGameList } from "../../datastore/getGameList.js";
import { upsertGameList } from "../../datastore/upsertGameList.js";

export const migrateGameList = async (context, req, res) => {
    const gameList = await getGameList(context.security.userAuth.id);

    const objectItems = gameList.games.map((game) => {
        return typeof game === "object" ? game : { id: game };
    });

    gameList.games = objectItems;
    await upsertGameList(context.security.userAuth.id, gameList.games, "default");

    res.status(200).end();
};