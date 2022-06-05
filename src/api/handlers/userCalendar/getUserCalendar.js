import { getGameList } from "../../datastore/getGameList.js";
import ical from "ical-generator";
import { getCalendar } from "../../datastore/getCalendar.js";
import { calendarFields } from "../../igdb/gamesFieldLists.js";
import { getGamesData } from "../../library/getGamesData.js";

export const getUserCalendar = async (context, req, res) => {
    const calendar = await getCalendar(context.request.params.user_id, req.query.token);
    if (calendar) {
        const gameList = await getGameList(context.request.params.user_id);
        const games = await getGamesData(gameList.games, calendarFields);

        const outputCalendar = ical({ name: "Game Release Calendar" });

        games.forEach((game) => {
            if (game.first_release_date) {
                outputCalendar.createEvent({
                    start: new Date(game.first_release_date * 1000),
                    summary: game.name,
                    allDay: true,
                });
            }
        });

        res.status(200).send(outputCalendar.toString());
    } else {
        res.status(404).json({ error: "not_found", message: "calendar not found" });
    }
};
