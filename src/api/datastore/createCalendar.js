import { Datastore } from "@google-cloud/datastore";
/**
 * @module datastore/createCalendar
 */

/**
 * Create a calendar for a user in Datastore
 * @async
 * @param {string} userId
 * @param {Object} calendarFields
 * @returns {Promise<void>}
 */
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
