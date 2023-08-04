// @ts-nocheck
import { deleteAccess } from "@/api/handlers/deleteAccess";
import { getContext } from "../expressMocks";

it("should delete cookie and return 200", () => {
    const context = getContext("deleteAccess");
    context.request.logout = jest.fn().mockImplementationOnce((cb) => cb(null));

    deleteAccess(context, context.request, context.response);

    expect(context.response.cookie).toBeCalledWith("auth_key", expect.stringContaining(""), { maxAge: 0 });
    expect(context.response.status).toBeCalledWith(200);
});