import { Datastore } from "@google-cloud/datastore";
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

    user.id = getUserId(user);

    return user;
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

    users.forEach((user) => {
        user.id = getUserId(user);
    });

    return users;
};

/**
 *
 * @param {AuthKey} authKey
 * @returns
 */
export const getUserByAuthKey = async (authKey) => {
    const datastore = new Datastore();

    const query = datastore.createQuery("user").filter("auth_key", "=", authKey);
    const [users] = await datastore.runQuery(query);

    if (users.length > 0) {
        const user = { id: getUserId(users[0]), ...users[0] };
        delete user[Datastore.KEY];
        return user;
    }
};

/**
 * Get User ID from Datastore Result
 * @param {any} user
 * @returns {UserID}
 */
function getUserId(user) {
    return user[Datastore.KEY].name;
}
