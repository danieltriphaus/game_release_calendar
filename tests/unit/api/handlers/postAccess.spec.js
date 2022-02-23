import { postAccess } from "@/api/handlers/postAccess";
import { getContext, getRequest, getResponse } from "../expressMocks";
import axios from "axios";

jest.mock("axios");

const context = getContext("post-access");

it("should return 401 with error if apiKey is invalid", async () => {
    const response = getResponse();
    const request = getRequest();
    request.body.apiKey = "invalid_api_key";

    await postAccess(context, request, response);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({}));
});

it("should return 200 and set cookies with api_key and igdb access token if apiKey is valid", async () => {
    const response = getResponse();
    const request = getRequest();
    request.body.apiKey = "test_api_key";

    const tokenResponse = {
        access_token: "prau3ol6mg5glgek8m89ec2s9q5i3i",
        expires_in: 5587808,
        token_type: "bearer",
    };

    axios.post.mockResolvedValueOnce({ data: tokenResponse });

    await postAccess(context, request, response);

    expect(response.cookie).toHaveBeenCalledWith("api_key", request.body.apiKey, {
        maxAge: tokenResponse.expires_in * 1000,
        httpOnly: true,
        secure: true,
    });
    expect(response.cookie).toHaveBeenCalledWith("igdb_access_token", tokenResponse.access_token, {
        maxAge: tokenResponse.expires_in * 1000,
        httpOnly: true,
        secure: true,
    });
    expect(response.status).toHaveBeenCalledWith(200);
});

it("should return error object if external request failed", async () => {
    const response = getResponse();
    const request = getRequest();
    request.body.apiKey = "test_api_key";

    const failedExternalResponse = { data: { status: 400, message: "invalid client" } };

    axios.post.mockRejectedValueOnce({ response: failedExternalResponse });

    await postAccess(context, request, response);

    expect(response.status).toHaveBeenCalledWith(failedExternalResponse.data.status);
    expect(response.json).toHaveBeenCalledWith({
        error: "external_request",
        message: failedExternalResponse.data.message,
    });
});
