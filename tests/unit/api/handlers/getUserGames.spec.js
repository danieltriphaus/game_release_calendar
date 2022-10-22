import { getUserGames } from "@/api/handlers/userGames/getUserGames.js";
import { getContext } from "../expressMocks.js";
import { getGameList } from "@/api/datastore/getGameList.js";
import { getGamesData } from "@/api/library/getGamesData.js";

jest.mock("@/api/datastore/getGameList.js");
jest.mock("@/api/library/getGamesData.js");

it("should return 404 if no game list is found", async () => {
    const context = getContext();

    await getUserGames(context, context.request, context.response);

    expect(context.response.status).toBeCalledWith(404);
});

it("should return igdb Data for games in GameList and add the selected platform", async () => {
    const testGameList = { games:
        [
            { id: 456 },
            { id: 789, platform: 6 },
            { id: 5648 },
        ],
    };
    const testGamesData = [
        {
            id: 456,
            name: "Test Game 01",
        },
        {
            id: 789,
            name: "Test Game 02",
        },
        {
            id: 5648,
            name: "Test Game 03",
        },
    ];

    const gamesDataWithSelectedPlatform = [...testGamesData];
    gamesDataWithSelectedPlatform[1].selectedPlatform = testGameList.games[1].platform;

    const context = getContext();

    getGameList.mockResolvedValueOnce(testGameList);
    getGamesData.mockResolvedValueOnce(testGamesData);

    await getUserGames(context, context.request, context.response);

    expect(context.response.status).toBeCalledWith(200);
    expect(context.response.json).toBeCalledWith(gamesDataWithSelectedPlatform);
});