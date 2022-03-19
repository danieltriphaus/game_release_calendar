import { getGameList } from "../datastore/getGameList.js";
import ical from "ical-generator";
import axios from "axios";
import { getCalendar } from "../datastore/getCalendar.js";

const query = "fields name, first_release_date; where id = ({gameIds});";

export const getUserCalendar = async (context, req, res) => {
    const calendar = await getCalendar(context.request.params.user_id, req.query.token);
    if (calendar) {
        const gameList = await getGameList(context.request.params.user_id);
        const gameIdsString = gameList.games.join(",");

        const response = await axios.post("https://api.igdb.com/v4/games", query.replace("{gameIds}", gameIdsString), {
            headers: {
                Accept: "application/json",
                "Content-Type": "text/plain",
                "Client-ID": process.env.IGDB_API_CLIENT_ID,
                Authorization: "Bearer " + calendar.igdbAccessToken,
            },
        });

        const outputCalendar = ical({ name: "Game Release Calendar" });
        const games = response.data;

        games.forEach((game) => {
            outputCalendar.createEvent({
                start: new Date(game.first_release_date * 1000),
                summary: game.name,
                allDay: true,
            });
        });

        res.status(200).send(outputCalendar.toString());
    } else {
        res.status(404).json({ error: "not_found", message: "calendar not found" });
    }
};
