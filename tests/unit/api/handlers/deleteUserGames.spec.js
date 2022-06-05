import { deleteUserGames } from "@/api/handlers/userGames/deleteUserGames";
import { getContext } from "../expressMocks";
import { upsertGameList } from "@/api/datastore/upsertGameList";
import { getGameList } from "@/api/datastore/getGameList";

jest.mock("@/api/datastore/upsertGameList");
jest.mock("@/api/datastore/getGameList");

it("should delete game from datastore", async () => {
    const gameListGames = ["6WjXhK3Iec1C9UwTBqJhH", 123, 132, 165, 789];
    const gameListDeleted = [123, 789];
    getGameList.mockResolvedValueOnce({ games: gameListGames });

    const context = getContext();
    context.request.params.user_id = "y1xx";
    context.request.body = ["6WjXhK3Iec1C9UwTBqJhH", 132, 165];

    await deleteUserGames(context, context.request, context.response);

    expect(upsertGameList).toHaveBeenCalledWith("y1xx", gameListDeleted, expect.stringContaining(""));
    expect(context.response.status).toHaveBeenCalledWith(200);
});
