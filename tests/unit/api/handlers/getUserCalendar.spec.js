import { getUserCalendar } from "@/api/handlers/getUserCalendar";
import { getGameList } from "@/api/datastore/getGameList";
import { getCalendar } from "@/api/datastore/getCalendar";
import axios from "axios";
import { getContext } from "../expressMocks";

jest.mock("axios");
jest.mock("@/api/datastore/getGameList");
jest.mock("@/api/datastore/getCalendar");

const gameList = {
    games: [119308, 112874],
};

const calendar = {
    token: "calendar_token",
    igdbAccessToken: "igdb_token",
};

const gameResponse = [
    {
        id: 112874,
        first_release_date: 1645142400,
        name: "Horizon Forbidden West",
        calendarDate: "20220218",
    },
    {
        id: 119308,
        first_release_date: 1648166400,
        name: "GhostWire: Tokyo",
        calendarDate: "20220325",
    },
];

it("should add gameIds as string to igdb request", async () => {
    getGameList.mockResolvedValueOnce(gameList);
    getCalendar.mockResolvedValueOnce(calendar);
    axios.post.mockResolvedValueOnce({ data: gameResponse });

    const context = getContext();
    context.request.query = calendar.token;

    await getUserCalendar(context, context.request, context.response);

    expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/games"),
        expect.stringContaining(gameList.games[0].toString(), gameList.games[1].toString()),
        expect.objectContaining({
            headers: expect.objectContaining({ Authorization: "Bearer " + calendar.igdbAccessToken }),
        })
    );
});

it("should create calendar from returned game data", async () => {
    getGameList.mockResolvedValueOnce(gameList);
    getCalendar.mockResolvedValueOnce(calendar);
    axios.post.mockResolvedValueOnce({ data: gameResponse });

    const context = getContext();
    context.request.query = calendar.token;

    await getUserCalendar(context, context.request, context.response);

    expect(context.response.status).toBeCalledWith(200);
    gameResponse.forEach((game) => {
        expect(context.response.send).toBeCalledWith(expect.stringContaining(game.name, "20220218"));
    });
    expect(context.response.send).toBeCalledWith(expect.stringContaining(gameResponse[0].name, "20220218"));
});

it("should return 404 if calendar cannot be found", async () => {
    getGameList.mockResolvedValueOnce(gameList);
    axios.post.mockResolvedValueOnce({ data: gameResponse });

    const context = getContext();
    context.request.query = "wrong_calendar_token";

    await getUserCalendar(context, context.request, context.response);

    expect(context.response.status).toBeCalledWith(404);
    expect(context.response.json).toBeCalledWith(
        expect.objectContaining({ error: expect.stringContaining(""), message: expect.stringContaining("") })
    );
});
