import { jest } from "@jest/globals";

export function getContext(operationId) {
    return {
        operation: {
            operationId,
        },
        request: getRequest(),
        response: getResponse(),
    };
}

export function getRequest() {
    return {
        body: {},
        params: {},
        cookies: {},
    };
}

export function getResponse() {
    const response = {
        cookie: jest.fn(() => response),
        status: jest.fn(() => response),
        json: jest.fn(() => response),
        send: jest.fn(() => response),
        end: jest.fn(() => response),
    };

    return response;
}
