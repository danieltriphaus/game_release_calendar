import { getUserByAuthKey } from "../datastore/getUser.js";
import { getCalendar } from "../datastore/getCalendar.js";

export const userAuth = async (context, req, res) => {
    if (process.env.NODE_ENV === "development" && req.query.auth_key) {
        req.cookies.auth_key = req.query.auth_key;
        res.cookie("auth_key", req.query.auth_key, { httpOnly: true });
    }

    const user = await getUserByAuthKey(req.cookies.auth_key);

    if (context.request.params.user_id && context.request.params.user_id === user.id) {
        return user;
    }
    if (!context.request.params.user_id && user) {
        return user;
    }
};

export const calendarToken = async (context) => {
    const calendar = await getCalendar(context.request.params.user_id, context.request.query.token);
    return calendar;
};
