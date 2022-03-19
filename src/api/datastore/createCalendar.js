import { Datastore } from "@google-cloud/datastore";

export const createCalendar = async (userId, token, igdbAccessToken) => {
    const datastore = new Datastore();

    const calendarEntity = {
        key: datastore.key(["user", userId, "calendar", token]),
        data: {
            createdAt: new Date(),
            token,
            igdbAccessToken,
        },
    };

    await datastore.upsert(calendarEntity);
};
