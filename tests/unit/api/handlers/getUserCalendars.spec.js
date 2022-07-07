import { getUserCalendars } from "@/api/handlers/userCalendar/getUserCalendars";
import { getContext } from "../expressMocks";
import { getCalendars } from "@/api/datastore/getCalendars.js";

jest.mock("@/api/datastore/getCalendars.js");

const userCalendars = [
    {
        createdAt: new Date("2022-03-19T12:35:56.866Z"),
        token: "test_calendar_token_01",
        list: "default",
    },
    {
        createdAt: new Date("2022-03-19T12:35:17.903Z"),
        token: "test_calendar_token_02",
    },
];

it("should return all calendars of user", async () => {
    getCalendars.mockResolvedValueOnce(userCalendars);

    const context = getContext();
    context.request.params.user_id = "testUser";

    await getUserCalendars(context, context.request, context.response);

    expect(context.response.json).toBeCalledWith(userCalendars);
});

it("should return list calendars of user", async () => {
    getCalendars.mockResolvedValueOnce(userCalendars);

    const context = getContext();
    context.request.params.user_id = "testUser";
    context.request.query = { list: "default" };

    await getUserCalendars(context, context.request, context.response);

    expect(context.response.json).toBeCalledWith([userCalendars[0]]);
});

it("should return with 404 if no calendars are found", async () => {
    getCalendars.mockResolvedValueOnce([]);

    const context = getContext();
    context.request.params.user_id = "testUser";

    await getUserCalendars(context, context.request, context.response);

    expect(context.response.status).toBeCalledWith(404);
});

it("should return with 404 if no calendars with list are found", async () => {
    getCalendars.mockResolvedValueOnce([userCalendars[1]]);

    const context = getContext();
    context.request.params.user_id = "testUser";
    context.request.query = { list: "default" };

    await getUserCalendars(context, context.request, context.response);

    expect(context.response.status).toBeCalledWith(404);
});
