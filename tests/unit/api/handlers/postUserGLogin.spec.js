import { postUserGLogin } from "@/api/handlers/postUserGLogin";

import { getContext } from "../expressMocks";

jest.mock("google-auth-library");

it.skip("should return error on csrf if no tokens are send", () => {
    const context = getContext("post-user-g-login");

    postUserGLogin(context, context.request, context.response);

    context.request.cookies = { g_csrf_token: "csrf_token" };
    context.request.body = { g_csrf_token: "wrong token" };

    expect(context.response.status).toBeCalledWith(400);
});

it.skip("should return error on csrf if the tokens are different", () => {
    const context = getContext("post-user-g-login");

    context.request.cookies = { g_csrf_token: "token_1" };
    context.request.body = { g_csrf_token: "token_2" };

    postUserGLogin(context, context.request, context.response);

    expect(context.response.status).toBeCalledWith(400);
});
