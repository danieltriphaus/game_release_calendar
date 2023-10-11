import axios from "axios";

const USER_API_PATH = "/api/user/";

/**
 * API methods for user api
 * @param {string} [userId]
 */
export const user = (userId) => {
    /**
     * @type {ProxyHandler<{}>}
     */
    const PROXY_HANDLER_USERID_REQUIRED = {
        get(target, prop, descriptor) {
            if (typeof target[prop] === "function" && !userId) {
                throw new Error("userId is required for user.games");
            }
            return Reflect.get(target, prop, descriptor);
        },
    };

    return {
        /**
         * @type {Object}
         * @property {function} post
         */
        gLogin: {
            /**
             * @param {*} credential
             * @returns {Promise<User|undefined>}
             */
            async post(credential) {
                const response = await axios.post("/api/user/g-login", { credential });
                if (response) {
                    return response.data;
                }
            },
        },
        /**
         * @type {Object}
         * @property {function} get
         * @property {function} post
         * @property {function} delete
         */
        games: new Proxy({
            /**
             * Add games to user's game list
             * @async
             * @param {UserGame[]} games
             * @param {string} [listId]
             */
            async post(games, listId) {
                await axios.post(USER_API_PATH + userId + "/games", { listId: listId, games: games });
            },

            /**
             * Get user's game list
             * @async
             * @param {string} [listId]
             * @returns {Promise<IGDBGame[]|undefined>}
             */
            async get(listId) {
                const response = await axios.get("/api/user/" + userId + "/games", { params: { listId } });
                if (response) {
                    return response.data;
                }
            },

            /**
             * Delete games from user's game list
             * @param {UserGame[]} games
             * @param {string} [listId]
             */
            async delete(games, listId) {
                await axios.delete(USER_API_PATH + userId + "/games", { data: { listId: listId, games: games } });
            },
        }, PROXY_HANDLER_USERID_REQUIRED),
        lists: new Proxy({
            /**
             * @returns {Promise<UserList|undefined>}
             */
            async get() {
                const response = await axios.get(USER_API_PATH + userId + "/lists");
                if (response) {
                    return response.data;
                }
            },

            /**
             * @param {Array<UserList>} lists
             */
            async post(lists) {
                await axios.post(USER_API_PATH + userId + "/lists", lists);
            },
        }, PROXY_HANDLER_USERID_REQUIRED),
        /**
         * @type {Object}
         * @property {function} get
         */
        calendars: new Proxy({
            /**
             * @param {string} [listId="default"]
             * @returns {Promise<Calendar[]|undefined>}
             */
            async get(listId) {
                const response = await axios.get(USER_API_PATH + userId + "/calendars", { params: { list: listId ? listId : "default" } });
                if (response) {
                    return response.data;
                }
            },
        }, PROXY_HANDLER_USERID_REQUIRED),
        /**
         * @type {Object}
         * @property {function} post
         */
        calendar: new Proxy({
            /**
             * @param {string} [listId="default"]
             * @returns {Promise<Calendar|undefined>}
             */
            async post(listId) {
                const response = await axios.post(USER_API_PATH + userId + "/calendar", { list: listId ? listId : "default" });
                if (response) {
                    return response.data;
                }
            },
        }, PROXY_HANDLER_USERID_REQUIRED),
    };
};