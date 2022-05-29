import { upsertGame } from "../datastore/upsertGame.js";

export const postGame = async (context, req, res) => {
    await upsertGame(req.body);

    res.status(200).end();
};
