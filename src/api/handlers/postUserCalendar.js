import { getUser } from "../datastore/getUser.js";
import { nanoid } from "nanoid";
import { createCalendar } from "../datastore/createCalendar.js";

export const postUserCalendar = async (context, req, res) => {
    const user = await getUser(context.request.params.user_id);

    if (user.password === req.body.password) {
        const token = nanoid(32);
        await createCalendar(context.request.params.user_id, token);
        res.status(200).json(token);
    } else {
        res.status(401).json({ error: "unauthorized", message: "wrong password" });
    }
};
