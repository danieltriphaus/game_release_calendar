import { jest } from "@jest/globals";
import axios from "axios";

jest.mock("axios");

const gameList = [
    {
        id: 11156,
        cover: { id: 133030, height: 1380, url: "//images.igdb.com/igdb/image/upload/t_thumb/co2una.jpg", width: 1035 },
        first_release_date: 1648654871,
        involved_companies: [
            { id: 24445, company: { id: 1843, name: "Guerrilla Games" }, developer: true },
            { id: 149775, company: { id: 10100, name: "Sony Interactive Entertainment" }, developer: false },
        ],
        name: "Horizon Zero Dawn",
    },
    {
        id: 136150,
        //first_release_date: 1488326400,
        involved_companies: [
            { id: 143054, company: { id: 1843, name: "Other Developer" }, developer: true },
            { id: 143055, company: { id: 45, name: "Sony Computer Entertainment, Inc. (SCEI)" }, developer: false },
        ],
        name: "Horizon Zero Dawn: Limited Edition",
    },
    {
        id: 111456,
        cover: { id: 133030, height: 1380, url: "//images.igdb.com/igdb/image/upload/t_thumb/co2una.jpg", width: 1035 },
        first_release_date: 1488240000,
        involved_companies: [{ id: 24436, company: { id: 1823, name: "Developer 3" }, developer: true }],
        name: "Game the Third",
    },
];

export const mockApi = () => {
    const config = {
        respondWith: 200,
    };
    const endpoints = [
        {
            url: "/api/game/search",
            method: "GET",
            responses: { 200: { resolve: true, data: gameList }, 401: { reject: true, data: {} } },
        },
        {
            url: "/api/user/y1xx/games",
            method: "GET",
            responses: { 200: { resolve: true, data: gameList }, 401: { reject: true, data: {} } },
        },
    ];

    axios.get.mockImplementation((url) => {
        const foundEndpoint = endpoints.find((endpoint) => {
            return endpoint.method === "GET" && endpoint.url === url;
        });

        if (foundEndpoint.responses[config.respondWith].resolve) {
            return Promise.resolve({
                status: config.respondWith,
                data: foundEndpoint.responses[config.respondWith].data,
            });
        } else if (foundEndpoint.responses[config.respondWith].reject) {
            return Promise.reject({
                status: config.respondWith,
                data: foundEndpoint.responses[config.respondWith].data,
            });
        }
    });

    return {
        setRespondWith(statusCode) {
            config.respondWith = statusCode;
        },
        getEndpointResponseData(url, method, status = 200) {
            const ep = endpoints.find((endpoint) => {
                return endpoint.url === url && endpoint.method === method;
            });
            return ep.responses[status].data;
        },
    };
};
