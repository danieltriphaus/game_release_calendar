import { Datastore } from "@google-cloud/datastore";

export const getCalendar = async (userId, token) => {
    const datastore = new Datastore();
    const key = datastore.key(["user", userId, "calendar", token]);

    const [calendar] = await datastore.get(key);
    return calendar;
};
