import { Datastore } from "@google-cloud/datastore";

export const createCalendar = async (userId, calendarFields) => {
    const datastore = new Datastore();

    const calendarEntity = {
        key: datastore.key(["user", userId, "calendar", calendarFields.token]),
        data: {
            createdAt: new Date(),
            ...calendarFields,
        },
    };

    await datastore.upsert(calendarEntity);
};
