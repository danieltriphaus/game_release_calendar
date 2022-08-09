import { getUserCalendar } from "@/api/handlers/userCalendar/getUserCalendar";
import { getGameList } from "@/api/datastore/getGameList";
import { getCalendar } from "@/api/datastore/getCalendar";
import axios from "axios";
import { getContext } from "../expressMocks";
import { getIgdbAccessToken } from "@/api/igdb/igdbAccessToken.js";
import { convertFromDatastoreResult } from "@/api/datastore/getTemporaryGames.js";

jest.mock("axios");
jest.mock("@/api/datastore/getGameList");
jest.mock("@/api/datastore/getCalendar");
jest.mock("@/api/igdb/igdbAccessToken.js");
jest.mock("@/api/datastore/getTemporaryGames.js");

const gameList = {
    games: [119308, 112874, "6WjXhK3Iec1C9UwTBqJhH"],
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

const igdbAccessToken = {
    access_token: "testtoken",
};

it("should add gameIds as string to igdb request", async () => {
    convertFromDatastoreResult.mockReturnValueOnce([]);
    getGameList.mockResolvedValueOnce(gameList);
    getCalendar.mockResolvedValueOnce(calendar);
    getIgdbAccessToken.mockResolvedValueOnce(igdbAccessToken);
    axios.post.mockResolvedValueOnce({ data: gameResponse });

    const context = getContext();
    context.request.query = calendar.token;

    await getUserCalendar(context, context.request, context.response);

    expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/games"),
        expect.stringContaining(
            gameList.games[0].toString(),
            gameList.games[1].toString(),
            gameList.games[2].toString(),
        ),
        expect.objectContaining({
            headers: expect.objectContaining({ Authorization: "Bearer " + igdbAccessToken.access_token }),
        }),
    );
});

it("should create calendar from returned game data", async () => {
    convertFromDatastoreResult.mockReturnValueOnce([]);
    getGameList.mockResolvedValueOnce(gameList);
    getCalendar.mockResolvedValueOnce(calendar);
    getIgdbAccessToken.mockResolvedValueOnce(igdbAccessToken);
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
        expect.objectContaining({ error: expect.stringContaining(""), message: expect.stringContaining("") }),
    );
});

it("should not create event if release_date is undefined", async () => {
    gameResponse.push({ id: 12345, name: "Game Without Release Date" });

    convertFromDatastoreResult.mockReturnValueOnce([]);
    getGameList.mockResolvedValueOnce(gameList);
    getCalendar.mockResolvedValueOnce(calendar);
    getIgdbAccessToken.mockResolvedValueOnce(igdbAccessToken);
    axios.post.mockResolvedValueOnce({ data: gameResponse });

    const context = getContext();
    context.request.query = calendar.token;

    await getUserCalendar(context, context.request, context.response);

    expect(context.response.status).toBeCalledWith(200);
    expect(context.response.send).not.toBeCalledWith(
        expect.stringContaining(gameResponse[gameResponse.length - 1].name),
    );

    gameResponse.pop();
});
