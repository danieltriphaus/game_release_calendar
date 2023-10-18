import testEvent from "./testEvent.json";
import { getGamesData } from "../../api/library/getGamesData";
import dotenv from "dotenv";
import { displayFields } from "../../api/igdb/gamesFieldLists";
import { Datastore } from "@google-cloud/datastore";

dotenv.config();

async function getGames(listId) {
    const datastore = new Datastore({
        projectId: "grc-6732",
        keyFilename: "./event_credentials.json",
    });
    const key = datastore.key(["user", process.env.EVENT_ADMIN_USER, "game_list", listId]);

    const [gameList] = await datastore.get(key);

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
    "/state-of-play-september-2023/index.html": async () => {
        const games = await getGames("SoP202309");

        return {
            redirect: "/events/state-of-play-september-2023/",
            games,
        };
    },
};