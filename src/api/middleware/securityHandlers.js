import { getUserByAuthKey } from "../datastore/getUser.js";
import { getCalendar } from "../datastore/getCalendar.js";

export const userAuth = async (context, req, res) => {
    if (process.env.NODE_ENV === "development" && req.query.auth_key) {
        req.cookies.auth_key = req.query.auth_key;
        res.cookie("auth_key", req.query.auth_key, { httpOnly: true });
    }

    const user = await getUserByAuthKey(req.cookies.auth_key);

    let result;
    if (process.env.NODE_ENV === "production" && user.test) {
        result = false;
    } else if (!user.test && (!user.auth_key_expires_at || user.auth_key_expires_at < new Date())) {
        result = false;
    } else if (context.request.params.user_id && context.request.params.user_id === user.id) {
        result = user;
    } else if (!context.request.params.user_id && user) {
        result = user;
    }

    if (!result) {
        res.clearCookie("auth_key");
    }

    return result;
};

export const calendarToken = async (context) => {
    return await getCalendar(context.request.params.user_id, context.request.query.token);
};

export const gaeCron = async (context, req) => {
    if (process.env.NODE_ENV === "development") {
        return true;
    } else {
        if (req.headers["x-appengine-cron"] === "true"
            && req.headers["x-forwarded-for"]
            && req.headers["x-forwarded-for"].startsWith("0.1.0.2")) {
            return true;
        }
    }
};
