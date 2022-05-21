import { Datastore } from "@google-cloud/datastore";

export const upsertUser = async (userData) => {
    const datastore = new Datastore();

    const { id, ...userFields } = userData;

    const userEntity = {
        key: datastore.key(["user", id]),
        data: userFields,
    };

    await datastore.upsert(userEntity);
};
