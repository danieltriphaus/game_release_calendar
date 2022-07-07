import { nanoid } from "nanoid";
import { createCalendar } from "../../datastore/createCalendar.js";

export const postUserCalendar = async (context, req, res) => {
    const calendar = {
        token: nanoid(32),
        list: req.body.list,
    };
    await createCalendar(context.request.params.user_id, calendar);
    res.status(200).json(calendar);
};
