import { postAccess } from "@/api/handlers/postAccess";
import { getContext, getRequest, getResponse } from "../expressMocks";

const context = getContext("post-access");

it("should return 401 with error if apiKey is invalid", () => {
    const response = getResponse();
    const request = getRequest();
    request.body.apiKey = "invalid_api_key";

    postAccess(context, request, response);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({}));
});

it("should return 200 and set cookie if apiKey is valid", () => {
    const response = getResponse();
    const request = getRequest();
    request.body.apiKey = "test_api_key";

    postAccess(context, request, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.cookie).toHaveBeenCalledWith("api_key", request.body.apiKey);
});
