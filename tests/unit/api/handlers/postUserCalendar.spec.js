import { postUserCalendar } from "@/api/handlers/userCalendar/postUserCalendar";
import { getContext } from "../expressMocks";

import { createCalendar } from "@/api/datastore/createCalendar";
import { nanoid } from "nanoid";

jest.mock("@/api/datastore/getUser");
jest.mock("@/api/datastore/createCalendar");
jest.mock("nanoid");
jest.mock("@/api/igdb/igdbAccessToken.js");

it("should create and respond with calendar without list association in database", async () => {
    const context = getContext("post-user-calendar");
    context.request.params.user_id = "testUser";

    nanoid.mockReturnValueOnce("token");

    await postUserCalendar(context, context.request, context.response);

    expect(createCalendar).toHaveBeenCalledWith(context.request.params.user_id, { token: "token" });

    expect(context.response.json).toBeCalledWith({ token: "token" });
});

it("should create and respond with calendar with list association in database", async () => {
    const context = getContext("post-user-calendar");
    context.request.params.user_id = "testUser";
    context.request.body = { list: "hype" };

    nanoid.mockReturnValueOnce("token");

    await postUserCalendar(context, context.request, context.response);

    expect(createCalendar).toHaveBeenCalledWith(context.request.params.user_id, { token: "token", list: "hype" });
    expect(context.response.json).toBeCalledWith({ token: "token", list: "hype" });
});
