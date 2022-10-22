import { postUserGames } from "@/api/handlers/userGames/postUserGames";
import { getContext } from "../expressMocks";
import { upsertGameList } from "@/api/datastore/upsertGameList";
import { getGameList } from "@/api/datastore/getGameList";

jest.mock("@/api/datastore/upsertGameList");
jest.mock("@/api/datastore/getGameList");

afterEach(() => {
    jest.clearAllMocks();
});

it("add games to datastore", async () => {
    const gameListGames = [{ id: 123 }, { id: 789 }, { id: "6WjXhK3Iec1C9UwTBq123" }];
    getGameList.mockResolvedValueOnce({ games: gameListGames });

    const context = getContext();
    context.request.params.user_id = "y1xx";
    context.request.body = [{ id: 132 }, { id: 165 }, { id: "6WjXhK3Iec1C9UwTBqJhH" }];

    await postUserGames(context, context.request, context.response);

    expect(upsertGameList).toHaveBeenCalledWith(
        "y1xx",
        expect.arrayContaining([...context.request.body, ...gameListGames]),
        expect.stringContaining(""),
    );
    expect(context.response.status).toHaveBeenCalledWith(200);
});

it("create list and add games if no list could be found", async () => {
    const context = getContext();
    context.request.params.user_id = "y1xx";
    context.request.body = [{ id: 132 }, { id: 165 }, { id: "6WjXhK3Iec1C9UwTBqJhH" }];

    await postUserGames(context, context.request, context.response);

    expect(upsertGameList).toHaveBeenCalledWith(
        "y1xx",
        expect.arrayContaining(context.request.body),
        expect.stringContaining(""),
    );

    expect(context.response.status).toHaveBeenCalledWith(200);
});

it("should return 400 if input contains non valid fields", async () => {
    const context = getContext();
    context.request.params.user_id = "y1xx";
    context.request.body = [{ name: "no_id_game" }, { id: 132, platform: 6 }];

    await postUserGames(context, context.request, context.response);

    expect(upsertGameList).not.toHaveBeenCalled();

    expect(context.response.status).toHaveBeenCalledWith(400);
});

it("should return 400 if input contains non objects", async () => {
    const context = getContext();
    context.request.params.user_id = "y1xx";
    context.request.body = ["only_string", { id: 132, platform: 6 }];

    await postUserGames(context, context.request, context.response);

    expect(upsertGameList).not.toHaveBeenCalled();

    expect(context.response.status).toHaveBeenCalledWith(400);
});

it("should return 400 if input does not contain mandatory fields", async () => {
    const context = getContext();
    context.request.params.user_id = "y1xx";
    context.request.body = [{ platform: 6 }];

    await postUserGames(context, context.request, context.response);

    expect(upsertGameList).not.toHaveBeenCalled();

    expect(context.response.status).toHaveBeenCalledWith(400);
});

it("should return 400 if inputs are not valid types", async () => {
    const context = getContext();
    context.request.params.user_id = "y1xx";
    context.request.body = [{ id: "daiodnwa", platform: "PS5" }];

    await postUserGames(context, context.request, context.response);

    expect(upsertGameList).not.toHaveBeenCalled();
    expect(context.response.status).toHaveBeenCalledWith(400);

    jest.clearAllMocks();

    context.request.body = [{ id: { key: "dwaip" }, platform: 6 }];

    await postUserGames(context, context.request, context.response);

    expect(upsertGameList).not.toHaveBeenCalled();
    expect(context.response.status).toHaveBeenCalledWith(400);
});


it("should change platform on existing game in list", async () => {
    const gameListGames = [{ id: 123 }];
    getGameList.mockResolvedValueOnce({ games: gameListGames });

    const context = getContext();
    context.request.params.user_id = "y1xx";
    context.request.body = [{ id: 132, platform: 6 }];

    await postUserGames(context, context.request, context.response);

    expect(upsertGameList).toHaveBeenCalledWith(
        "y1xx",
        context.request.body,
        expect.stringContaining(""),
    );
    expect(context.response.status).toHaveBeenCalledWith(200);
});