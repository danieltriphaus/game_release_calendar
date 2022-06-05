import { postUserGames } from "@/api/handlers/userGames/postUserGames";
import { getContext } from "../expressMocks";
import { upsertGameList } from "@/api/datastore/upsertGameList";
import { getGameList } from "@/api/datastore/getGameList";

jest.mock("@/api/datastore/upsertGameList");
jest.mock("@/api/datastore/getGameList");

it("add games to datastore", async () => {
    const gameListGames = [123, 789, "6WjXhK3Iec1C9UwTBq123"];
    getGameList.mockResolvedValueOnce({ games: gameListGames });

    const context = getContext();
    context.request.params.user_id = "y1xx";
    context.request.body = [132, 165, "6WjXhK3Iec1C9UwTBqJhH"];

    await postUserGames(context, context.request, context.response);

    expect(upsertGameList).toHaveBeenCalledWith(
        "y1xx",
        expect.arrayContaining([...context.request.body, ...gameListGames]),
        expect.stringContaining("")
    );
    expect(context.response.status).toHaveBeenCalledWith(200);
});

it("create list and add games if no list could be found", async () => {
    const context = getContext();
    context.request.params.user_id = "y1xx";
    context.request.body = [132, 165, "6WjXhK3Iec1C9UwTBqJhH"];

    await postUserGames(context, context.request, context.response);

    expect(upsertGameList).toHaveBeenCalledWith(
        "y1xx",
        expect.arrayContaining(context.request.body),
        expect.stringContaining("")
    );

    expect(context.response.status).toHaveBeenCalledWith(200);
});
