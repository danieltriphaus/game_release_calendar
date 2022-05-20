import { getUser } from "../datastore/getUser.js";
import { nanoid } from "nanoid";
import { createCalendar } from "../datastore/createCalendar.js";
import { getIgdbAccessToken } from "../igdb/igdbAccessToken.js";

export const postUserCalendar = async (context, req, res) => {
    const [user, accessToken] = await Promise.all([getUser(context.request.params.user_id), getIgdbAccessToken()]);

    if (user.password === req.body.password) {
        const token = nanoid(32);
        await createCalendar(context.request.params.user_id, token, accessToken.access_token);
        res.status(200).json(token);
    } else {
        res.status(401).json({ error: "unauthorized", message: "wrong password" });
    }
};
