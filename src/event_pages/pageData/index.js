import testEvent from "./testEvent.json";
import sonySoP202308 from "./sonySoP202308.json";
import { getGameList } from "../../api/datastore/getGameList";
import { getGamesData } from "../../api/library/getGamesData";
import dotenv from "dotenv";
import { displayFields } from "../../api/igdb/gamesFieldLists";

dotenv.config();

async function getGames(listId) {
    const gameList = await getGameList(process.env.EVENT_ADMIN_USER, listId);
    return await getGamesData(gameList.games.map((game) => game.id), displayFields);
}

export default {
    "/test-event/index.html": {
        redirect: "/events/test-event/",
        games: testEvent,
    },
    "/the-game-awards-2023/index.html": async () => {
        const games = await getGames("tga2023");

        return {
            redirect: "/events/the-game-awards-2023/",
            games,
        };
    },
    "/state-of-play-september-2023/index.html": {
        redirect: "/events/state-of-play-september-2023/",
        games: sonySoP202308,
    },
};