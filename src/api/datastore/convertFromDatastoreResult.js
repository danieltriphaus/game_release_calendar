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

    return result
        ? result.map((datastoreResult) => {
            return { id: datastoreResult[Datastore.KEY].name ? datastoreResult[Datastore.KEY].name : datastoreResult[Datastore.KEY].id, ...datastoreResult };
        })
        : [];

};

/**
 * @param {any} entity
 * @returns {{id: string, parent?: string}}
 */
export const getKeyFromDatastoreEntity = (entity) => {
    const key = entity[Datastore.KEY];
    if (!key.parent) {
        return { id: key.id ? key.id : key.name };
    } else {
        return {
            id: key.id ? key.id : key.name,
            parent: key.parent.id ? key.parent.id : key.parent.name,
        };
    }
};