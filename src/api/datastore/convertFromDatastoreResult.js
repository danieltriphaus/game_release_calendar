import { Datastore } from "@google-cloud/datastore";
/**
 * convertFromDatastoreResult
 * @module datastore/convertFromDatastoreResult
 */


/**
 * convertFromDatastoreResult
 * @param {Array | undefined} result
 * @returns {Array | undefined}
 */
export const convertFromDatastoreResult = (result) => {
    if (result) {
        return result
            ? result.map((datastoreResult) => {
                return { id: datastoreResult[Datastore.KEY].name ? datastoreResult[Datastore.KEY].name : datastoreResult[Datastore.KEY].id, ...datastoreResult };
            })
            : [];
    }
};