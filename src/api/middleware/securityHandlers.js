//import { getUserByAuthKey } from "../datastore/getUser.js";
import { getCalendar } from "../datastore/getCalendar.js";

export const userAuth = async (context, req) => {
    if (req.isAuthenticated()) {
        return req.user;
    }
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
