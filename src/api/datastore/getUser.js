import { Datastore } from "@google-cloud/datastore";
import { convertFromDatastoreResult } from "./convertFromDatastoreResult.js";

/**
 * @module datastore/getUser
 */

/**
 * Get a user from id
 * @param {UserId} userId
 * @returns {Promise<Array>}
 */
export const getUser = async (userId) => {
    const datastore = new Datastore();

    const userKey = datastore.key(["user", userId]);
    const [user] = await datastore.get(userKey);

    if (user.length > 0) {
        return convertFromDatastoreResult(user)[0];
    }
};

/**
 * get a user object by its email adress
 * @param {EmailAddress} emailAddress
 * @returns {Promise<Array>}
 */
export const getUsersByEmailAddress = async (emailAddress) => {
    const datastore = new Datastore();

    const query = datastore.createQuery("user").filter("email_address", "=", emailAddress);
    const [users] = await datastore.runQuery(query);

    if (users.length > 0) {
        return convertFromDatastoreResult(users);
    }
};

/**
 * get a user object by its email adress
 * @param {string} googleId
 * @returns {Promise<Array>}
 */
export const getUsersByGoogleId = async (googleId) => {
    const datastore = new Datastore();

    const query = datastore.createQuery("user").filter("google_id", "=", googleId);
    const [users] = await datastore.runQuery(query);

    if (users.length > 0) {
        return convertFromDatastoreResult(users);
    }
};

/**
 *
 * @param {AuthKey} authKey
 * @returns {Promise<User>}
 */
export const getUserByAuthKey = async (authKey) => {
    const datastore = new Datastore();

    const query = datastore.createQuery("user").filter("auth_key", "=", authKey);
    const [users] = await datastore.runQuery(query);

    if (users.length > 0) {
        return convertFromDatastoreResult(users)[0];
    }
};