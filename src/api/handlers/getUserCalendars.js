import { getCalendars } from "../datastore/getCalendars.js";

export const getUserCalendars = async (context, req, res) => {
    const calendars = await getCalendars(context.request.params.user_id);

    const resultCalendars = calendars.map((element) => {
        // eslint-disable-next-line no-unused-vars
        const { igdbAccessToken, ...calendar } = element;
        return calendar;
    });

    res.status(200).json(resultCalendars);
};
