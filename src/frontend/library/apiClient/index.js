/*
await axios.post("/api/user/g-login", { credential: response.credential });
await axios.delete("/api/access");
axios.post("/api/game", { ...temporaryGame });
axios.get("/api/access", axiosRequestConfig).catch((error) => {
axios.delete("/api/user/" + user.value.id + "/games", { data: { games: userGames, listId: "default" } })
axios.post(USER_API_PATH + user.value.id + "/calendar", { list: "default" });
axios.post("/api/user/" + user.value.id + "/games", { games: [{ id: props.game.id, platform: platformId }] });
axios.get("/api/user/" + props.userId + "/games");
axios.delete("/api/user/" + user.value.id + "/games", { data: { games: [{ id }] } });
await axios.get("/api/game/search", { params: { q: search.query } });
axios.post("/api/user/" + userId.value + "/games", { games: [{ id: props.result.id }] });
axios.get("/api/user/" + this.user.id + "/calendars");
axios.post("/api/user/" + this.user.id + "/calendar");

apiClient.postUserGames(userId, games, listId);
apiClient.userGames(userId).post(games, listId):
apiClient.user(userId).games.post(games, listId);
*/
//@ts-check
import axios from "axios";

const API_PATH_PREFIX = "/api";
const USER_API_PATH = API_PATH_PREFIX + "/user/";

export const apiClient = {
    /**
     * API methods for user api
     * @param {string} userId
     */
    user: (userId) => {
        return {
            games: {
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
                 * @returns {Promise<IGDBGame[]|undefined>}
                 */
                async get() {
                    const response = await axios.get("/api/user/" + userId + "/games");
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
            },
        };
    },
};