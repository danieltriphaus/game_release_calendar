import axios from "axios";

const USER_API_PATH = "/api/user/";

async function openGameListCache() {
    return await caches.open("gamestache-user-games");
}

/**
 * @param {string} userId
 * @param {import("axios").AxiosResponse} response
 */
async function putGameListCache(userId, response) {
    const cache = await openGameListCache();
    const responseBody = JSON.stringify(response.data);
    if (responseBody) {
        await cache.put(USER_API_PATH + userId + "/games", new Response(responseBody, { headers: response.headers }));
    }
}

async function getGameListCache(userId) {
    const cache = await openGameListCache();
    const gameListCache = await cache.match(USER_API_PATH + userId + "/games");

    if (gameListCache && new Date(gameListCache.headers.get("date")).getTime() + 1000 * 60 * 60 * 24 * 7 > new Date().getTime()) {
        return gameListCache;
    } else {
        await deleteGameListCache(userId);
    }
}

async function deleteGameListCache(userId) {
    const cache = await openGameListCache();
    return await cache.delete(USER_API_PATH + userId + "/games");
}


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
                const response = await axios.post(USER_API_PATH + "g-login", { credential });
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
                deleteGameListCache(userId);
                await axios.post(USER_API_PATH + userId + "/games", { listId: listId, games: games });
            },

            /**
             * Get user's game list
             * @async
             * @param {string} [listId]
             * @returns {Promise<IGDBGame[]|undefined>}
             */
            async get(listId) {
                const GameListCache = await getGameListCache(userId);
                if (GameListCache) {
                    return await GameListCache.json();
                }
                const response = await axios.get(USER_API_PATH + userId + "/games", { params: { listId } });
                if (response) {
                    putGameListCache(userId, response);
                    return response.data;
                }
            },

            /**
             * Delete games from user's game list
             * @param {UserGame[]} games
             * @param {string} [listId]
             */
            async delete(games, listId) {
                deleteGameListCache(userId);
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