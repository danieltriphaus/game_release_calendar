import { deleteUserGames } from "@/api/handlers/userGames/deleteUserGames";
import { getContext } from "../expressMocks";
import { upsertGameList } from "@/api/datastore/upsertGameList";
import { getGameList } from "@/api/datastore/getGameList";

jest.mock("@/api/datastore/upsertGameList");
jest.mock("@/api/datastore/getGameList");

it("should delete game from datastore", async () => {
    const gameListGames = [{ id: "6WjXhK3Iec1C9UwTBqJhH" }, { id: 123 }, { id: 132 }, { id: 165 }, { id: 789 }];
    const gameListDeleted = [{ id: 123 }, { id: 789 }];
    getGameList.mockResolvedValueOnce({ games: gameListGames });

    const context = getContext();
    context.request.params.user_id = "y1xx";
    context.request.body = { games: [{ id: "6WjXhK3Iec1C9UwTBqJhH" }, { id: 132 }, { id: 165 }] };

    await deleteUserGames(context, context.request, context.response);

    expect(upsertGameList).toHaveBeenCalledWith("y1xx", gameListDeleted, expect.stringContaining("default"));
    expect(context.response.status).toHaveBeenCalledWith(200);
});

it("should delete game from datastore from specific list", async () => {
    const gameListGames = [{ id: "6WjXhK3Iec1C9UwTBqJhH" }, { id: 123 }, { id: 132 }, { id: 165 }, { id: 789 }];
    const gameListDeleted = [{ id: 123 }, { id: 789 }];
    getGameList.mockResolvedValueOnce({ games: gameListGames });

    const context = getContext();
    context.request.params.user_id = "y1xx";
    context.request.body = { listId: "test_list", games: [{ id: "6WjXhK3Iec1C9UwTBqJhH" }, { id: 132 }, { id: 165 }] };

    await deleteUserGames(context, context.request, context.response);

    expect(upsertGameList).toHaveBeenCalledWith("y1xx", gameListDeleted, expect.stringContaining("test_list"));
    expect(context.response.status).toHaveBeenCalledWith(200);
});