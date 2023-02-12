// @ts-nocheck
import { getGamesById } from "@/api/igdb/getGamesById";
import axios from "axios";

jest.mock("axios");

it("should add field array to query", async () => {
    const fields = ["name", "release_date", "developer"];
    axios.post.mockResolvedValueOnce({ data: [] });

    await getGamesById([1, 2, 3], "test_token", fields);

    expect(axios.post).toBeCalledWith(
        expect.stringContaining(""),
        expect.stringContaining(fields.join(",")),
        expect.objectContaining({}),
    );
});
