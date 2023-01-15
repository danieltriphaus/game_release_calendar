import { Datastore } from "@google-cloud/datastore";
/**
 * @module datastore/getCalendars
 */


/**
 * Gets all calendars from a user
 * @async
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export const getCalendars = async (userId) => {
    const datastore = new Datastore();

    const ancestorKey = datastore.key(["user", userId]);
    const query = datastore.createQuery("calendar").hasAncestor(ancestorKey);

    const [calendars] = await datastore.runQuery(query);
    return calendars;
};
