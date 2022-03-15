import { Datastore } from "@google-cloud/datastore";

export const getUser = async (userId) => {
    const datastore = new Datastore();

    const userKey = datastore.key(["user", userId]);
    const [user] = await datastore.get(userKey);

    return user;
};
