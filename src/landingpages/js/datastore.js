const { Datastore } = require("@google-cloud/datastore");

/**
 * Get game lists which contain a specific game id
 * @async

 * @param {UserID} userId
 * @param {Boolean} withGames
 * @returns {Promise<Array>}
 */
module.exports = {
    getAllGameLists: async (userId) => {
        const datastore = new Datastore({
            projectId: "grc-6732",
            keyFilename: "./event_credentials.json",
        });
        const query = datastore.createQuery("game_list");
        if (userId) {
            query.hasAncestor(datastore.key(["user", userId]));
        }
        const [gameLists] = await datastore.runQuery(query);

        return gameLists;
    },

    /**
     * convertFromDatastoreResult
     * @param {Array | undefined} result
     * @returns {Array | undefined}
     */
    convertFromDatastoreResult: (result) => {
        return result
            ? result.map((datastoreResult) => {
                return { id: datastoreResult[Datastore.KEY].name ? datastoreResult[Datastore.KEY].name : datastoreResult[Datastore.KEY].id, ...datastoreResult };
            })
            : [];

    },

    filterEventLists: (gameLists) => {
        return gameLists.filter((gameList) => {
            return gameList[Datastore.KEY].name !== "default" && gameList[Datastore.KEY].name !== "archive";
        });
    },
};