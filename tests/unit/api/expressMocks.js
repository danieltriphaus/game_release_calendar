import { jest } from "@jest/globals";

export function getContext(operationId) {
    return {
        operation: {
            operationId,
        },
    };
}

export function getRequest() {
    return {
        body: {},
    };
}

export function getResponse() {
    const response = {
        cookie: jest.fn(() => response),
        status: jest.fn(() => response),
        json: jest.fn(() => response),
    };

    return response;
}
