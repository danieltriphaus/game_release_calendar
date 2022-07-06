import { getUserCalendars } from "@/api/handlers/userCalendar/getUserCalendars";
import { getContext } from "../expressMocks";
import { getCalendars } from "@/api/datastore/getCalendars.js";
import { createCalendar } from "@/api/datastore/createCalendar.js";

jest.mock("@/api/datastore/getCalendars.js");
jest.mock("@/api/igdb/igdbAccessToken.js");
jest.mock("@/api/datastore/createCalendar.js");

const calendars = [
    {
        createdAt: new Date("2022-03-19T12:35:56.866Z"),
        igdbAccessToken: "test_access_token",
        token: "test_calendar_token_01",
    },
    {
        createdAt: new Date("2022-03-19T12:35:17.903Z"),
        igdbAccessToken: "test_access_token",
        token: "test_calendar_token_02",
    },
];

it("should remove igdbAccessToken from result", async () => {
    const context = getContext();
    context.request.params.user_id = "testUser";

    getCalendars.mockResolvedValueOnce(calendars);

    await getUserCalendars(context, context.request, context.response);

    expect(context.response.status).toBeCalledWith(200);
    expect(context.response.json).not.toBeCalledWith(
        expect.arrayContaining([
            expect.objectContaining({
                igdbAccessToken: expect.stringContaining(""),
            }),
        ])
    );
});

it("should create default calendar if none are found and return it", async () => {
    const context = getContext();
    context.request.params.user_id = "testUser";
    getCalendars.mockResolvedValueOnce([]);

    await getUserCalendars(context, context.request, context.response);

    const newCalendar = {
        token: expect.stringContaining(""),
        list: "default",
    };

    expect(createCalendar).toBeCalledWith(context.request.params.user_id, newCalendar);
    expect(context.response.status).toBeCalledWith(200);
    expect(context.response.json).toBeCalledWith(expect.arrayContaining([expect.objectContaining(newCalendar)]));
});

it("should create default calendar if only calendars without lists are found and return it", async () => {
    const context = getContext();
    context.request.params.user_id = "testUser";
    getCalendars.mockResolvedValueOnce([{ token: 1234 }]);

    await getUserCalendars(context, context.request, context.response);

    const newCalendar = {
        token: expect.stringContaining(""),
        list: "default",
    };

    expect(createCalendar).toBeCalledWith(context.request.params.user_id, newCalendar);
    expect(context.response.status).toBeCalledWith(200);
    expect(context.response.json).toBeCalledWith(expect.arrayContaining([expect.objectContaining(newCalendar)]));
});
