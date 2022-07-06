import { getCalendars } from "../../datastore/getCalendars.js";
import { createCalendar } from "../../datastore/createCalendar.js";
import { nanoid } from "nanoid";

export const getUserCalendars = async (context, req, res) => {
    let calendars = await getCalendars(context.request.params.user_id);

    if (!calendars.length) {
        const calendar = {
            token: nanoid(32),
            list: "default",
        };
        await createCalendar(context.request.params.user_id, calendar);
        calendars = [calendar];
    }

    if (calendars) {
        const resultCalendars = calendars.map((element) => {
            // eslint-disable-next-line no-unused-vars
            const { igdbAccessToken, ...calendar } = element;
            return calendar;
        });

        res.status(200).json(resultCalendars);
    }
};
