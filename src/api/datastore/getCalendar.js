import { Datastore } from "@google-cloud/datastore";
/**
 * @module datastore/getCalendar
 */

/**
 * Get specific calendar of user
 * @async
 * @param {string} userId
 * @param {string} token
 * @returns {Promise<Array>}
 */
export const getCalendar = async (userId, token) => {
    const datastore = new Datastore();
    const key = datastore.key(["user", userId, "calendar", token]);

    const [calendar] = await datastore.get(key);
    return calendar;
};
