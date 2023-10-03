import { upsertGameList } from "../datastore/upsertGameList.js";

export const postUserLists = async (context, req, res) => {
    const gameLists = req.body;
    if (gameLists && gameLists.length > 0) {
        gameLists.forEach(async (gameList) => {
            await upsertGameList(context.request.params.user_id, [], gameList.id);
        });
        res.status(200).end();
    } else {
        res.status(400).end();
    }
};