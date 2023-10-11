//@ts-check
import axios from "axios";
import { user } from "./user.js";

const API_PATH_PREFIX = "/api";
const ACCESS_API_PATH = API_PATH_PREFIX + "/access/";

export const apiClient = {
    /**
     * API methods for user api
     * @param {string} [userId]
     */
    user,
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