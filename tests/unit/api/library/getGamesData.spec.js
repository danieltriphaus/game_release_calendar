import { getGamesData } from "@/api/library/getGamesData.js";
import { getTemporaryGames } from "@/api/datastore/getTemporaryGames.js";
import { getIgdbAccessToken } from "@/api/igdb/igdbAccessToken";
import axios from "axios";
import { Datastore } from "@google-cloud/datastore";

jest.mock("axios");
jest.mock("@/api/igdb/igdbAccessToken.js");

jest.mock("@/api/datastore/getTemporaryGames.js", () => ({
    ...jest.requireActual("@/api/datastore/getTemporaryGames.js"),
    getTemporaryGames: jest.fn(),
}));

jest.mock();

const igdbGames = [{ id: 123 }, { id: 456 }];

const datastoreGames = [{ name: "Temporary Game 01" }, { name: "Temporary Game 02" }];

const datastoreOutput = [...datastoreGames];

datastoreGames.forEach((game, index) => {
    game[Datastore.KEY] = { name: "test" + index };
    datastoreOutput[index].id = "test" + index;
});

it("should combine the datasources and return one array with games", async () => {
    getIgdbAccessToken.mockResolvedValueOnce("testtoken");
    axios.post.mockResolvedValueOnce({ data: igdbGames });
    getTemporaryGames.mockResolvedValueOnce(datastoreGames);

    const games = await getGamesData([123, 456], []);

    expect(games).toMatchObject([...igdbGames, ...datastoreOutput]);
});
