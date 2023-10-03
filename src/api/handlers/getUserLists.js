import { getAllGameLists } from "../datastore/getGameList.js";
import { convertFromDatastoreResult } from "../datastore/convertFromDatastoreResult.js";

export const getUserLists = async (context, req, res) => {
    const gameLists = await getAllGameLists(context.request.params.user_id);
    res.status(200).json(convertFromDatastoreResult(gameLists));
};