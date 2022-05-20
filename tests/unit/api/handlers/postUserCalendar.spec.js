import { postUserCalendar } from "../../../../src/api/handlers/postUserCalendar";
import { getContext } from "../expressMocks";

import { getUser } from "@/api/datastore/getUser";
import { createCalendar } from "@/api/datastore/createCalendar";
import { nanoid } from "nanoid";
import { getIgdbAccessToken } from "@/api/igdb/igdbAccessToken.js";

jest.mock("@/api/datastore/getUser");
jest.mock("@/api/datastore/createCalendar");
jest.mock("nanoid");
jest.mock("@/api/igdb/igdbAccessToken.js");

it("should respond with 401 when password is wrong", async () => {
    const context = getContext("post-user-calendar");
    context.request.body.password = "wrongPassword";
    context.request.params.user_id = "testUser";

    getUser.mockResolvedValueOnce({ password: "correctPassword" });

    await postUserCalendar(context, context.request, context.response);

    expect(context.response.status).toBeCalledTimes(1);
    expect(context.response.status).toHaveBeenCalledWith(401);
    expect(context.response.json).toHaveBeenCalledWith({
        error: expect.stringContaining(""),
        message: expect.stringContaining(""),
    });
});

it("should respond with token when password is correct", async () => {
    const context = getContext("post-user-calendar");
    context.request.body.password = "testPassword";
    context.request.params.user_id = "testUser";

    getUser.mockResolvedValueOnce({ password: "testPassword" });
    getIgdbAccessToken.mockResolvedValueOnce({ access_token: "test" });
    nanoid.mockReturnValueOnce("token");

    await postUserCalendar(context, context.request, context.response);

    expect(context.response.status).toBeCalledTimes(1);
    expect(context.response.status).toHaveBeenCalledWith(200);
    expect(context.response.json).toHaveBeenCalledWith("token");
});

it("should create calendar in database", async () => {
    const context = getContext("post-user-calendar");
    context.request.body.password = "testPassword";
    context.request.params.user_id = "testUser";

    getUser.mockResolvedValueOnce({ password: "testPassword" });
    getIgdbAccessToken.mockResolvedValueOnce({ access_token: "test" });
    nanoid.mockReturnValueOnce("token");

    await postUserCalendar(context, context.request, context.response);

    expect(createCalendar).toHaveBeenCalledWith(context.request.params.user_id, "token", expect.stringContaining(""));
});
