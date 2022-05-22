import { getUserCalendars } from "@/api/handlers/getUserCalendars";
import { getContext } from "../expressMocks";
import { getCalendars } from "@/api/datastore/getCalendars.js";

jest.mock("@/api/datastore/getCalendars.js");
jest.mock("@/api/igdb/igdbAccessToken.js");

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

it("shoudl return empty array if no calendars are found", async () => {
    const context = getContext();
    context.request.params.user_id = "testUser";
    getCalendars.mockResolvedValueOnce([]);

    await getUserCalendars(context, context.request, context.response);

    expect(context.response.status).toBeCalledWith(200);
    expect(context.response.json).toBeCalledWith([]);
});
