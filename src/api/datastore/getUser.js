import { Datastore } from "@google-cloud/datastore";

export const getUser = async (userId) => {
    const datastore = new Datastore();

    const userKey = datastore.key(["user", userId]);
    const [user] = await datastore.get(userKey);

    return user;
};

export const getUsersByEmailAddress = async (emailAddress) => {
    const datastore = new Datastore();

    const query = datastore.createQuery("user").filter("email_address", "=", emailAddress);
    const [users] = await datastore.runQuery(query);

    return users;
};
