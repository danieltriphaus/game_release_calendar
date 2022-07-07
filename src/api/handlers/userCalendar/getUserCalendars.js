import { getCalendars } from "../../datastore/getCalendars.js";

export const getUserCalendars = async (context, req, res) => {
    let calendars = await getCalendars(context.request.params.user_id);

    if (req.query.list) {
        calendars = calendars.filter((calendar) => calendar.list === req.query.list);
    }

    if (calendars.length > 0) {
        res.status(200).json(calendars);
    } else {
        res.status(404).json({
            error: "not_found",
            message: "entity not found",
        });
    }
};
