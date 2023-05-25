//@ts-check
import axios from "axios";

const API_PATH_PREFIX = "/api";
const USER_API_PATH = API_PATH_PREFIX + "/user/";
const ACCESS_API_PATH = API_PATH_PREFIX + "/access/";

export const apiClient = {
    /**
     * API methods for user api
     * @param {string} [userId]
     */
    user: (userId) => {
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
    },
    game: {
        search: {
            /**
             * search for games in IGDB
             * @param {string} query
             * @returns {Promise<IGDBGame[]|undefined>}
             */
            async get(query) {
                const response = await axios.get(API_PATH_PREFIX + "/game/search", { params: { q: query } });
                if (response) {
                    return response.data;
                }
            },
        },
        /**
         * @param {TemporaryGame} temporaryGame
         */
        async post(temporaryGame) {
            await axios.post("/api/game", temporaryGame);
        },

    },
    access: {
        /**
         * log in user or get user currently logged in
         * @async
         * @param {string} [authKey]
         * @returns {Promise<User|undefined>}
         */
        async get(authKey) {
            const response = await axios.get(ACCESS_API_PATH, { params: { auth_key: authKey } }).catch((error) => {
                if (error.response && error.response.status === 401) {
                    return;
                }
                throw error;
            });
            if (response) {
                return response.data;
            }
        },

        /**
         * log out user currently logged in
         * @async
         * @returns {Promise<boolean>}
         */
        async delete() {
            const response = await axios.delete(ACCESS_API_PATH);
            if (response.status === 200) {
                return true;
            }
        },
    },
};