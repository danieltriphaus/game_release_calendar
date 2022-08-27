import { Datastore } from "@google-cloud/datastore";

export const convertFromDatastoreResult = (result) => {
    if (result) {
        return result
            ? result.map((datastoreResult) => {
                return { id: datastoreResult[Datastore.KEY].name ? datastoreResult[Datastore.KEY].name : datastoreResult[Datastore.KEY].id, ...datastoreResult };
            })
            : [];
    }
};