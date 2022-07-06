import { nanoid } from "nanoid";
import { createCalendar } from "../../datastore/createCalendar.js";

export const postUserCalendar = async (context, req, res) => {
    const token = nanoid(32);
    await createCalendar(context.request.params.user_id, { token });
    res.status(200).json(token);
};
