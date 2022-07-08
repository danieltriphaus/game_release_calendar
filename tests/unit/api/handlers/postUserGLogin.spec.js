import { getGLoginPayload } from "@/api/library/getGLoginPayload.js";
import { postUserGLogin } from "@/api/handlers/postUserGLogin.js";
import { getContext } from "../expressMocks";
import { getUsersByEmailAddress } from "@/api/datastore/getUser.js";
import { upsertUser } from "@/api/datastore/upsertUser.js";

jest.mock("@/api/library/getGLoginPayload.js");
jest.mock("@/api/datastore/getUser.js");
jest.mock("@/api/datastore/upsertUser.js");

const googleUser = {
    sub: "1234dwa",
    email: "test@test.de",
};

const dbUser = {
    google_id: googleUser.sub,
    email_address: googleUser.email,
    auth_key: "test_auth_key",
};

it("should save google user in database if it does not exist", async () => {
    getGLoginPayload.mockResolvedValueOnce(googleUser);
    getUsersByEmailAddress.mockResolvedValueOnce([]);

    const context = getContext();
    context.request.body = { credential: "test" };

    await postUserGLogin(context, context.request, context.response);

    expect(upsertUser).toBeCalledWith(
        expect.objectContaining({
            google_id: googleUser.sub,
            email_address: googleUser.email,
            auth_key: expect.stringContaining(""),
        })
    );
});

it("should login user with auth_key", async () => {
    getGLoginPayload.mockResolvedValueOnce(googleUser);
    getUsersByEmailAddress.mockResolvedValueOnce([dbUser]);

    const context = getContext();
    context.request.body = { credential: "test" };

    await postUserGLogin(context, context.request, context.response);

    expect(context.response.cookie).toHaveBeenCalledWith(
        "auth_key",
        expect.stringContaining(""),
        expect.objectContaining({})
    );
});

it("should remove auth_key from result", async () => {
    getGLoginPayload.mockResolvedValueOnce(googleUser);
    getUsersByEmailAddress.mockResolvedValueOnce([dbUser]);

    const context = getContext();
    context.request.body = { credential: "test" };

    await postUserGLogin(context, context.request, context.response);

    expect(context.response.json).not.toBeCalledWith(
        expect.objectContaining({ auth_key: expect.stringContaining("") })
    );
});
