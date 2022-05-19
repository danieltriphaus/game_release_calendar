import { Datastore } from "@google-cloud/datastore";

export const upsertUser = async (userData) => {
    const datastore = new Datastore();

    const userEntity = {
        key: datastore.key(["user", userData.id]),
        data: {
            email_address: userData.email_address,
            google_id: userData.google_id,
        },
    };

    await datastore.upsert(userEntity);
};
