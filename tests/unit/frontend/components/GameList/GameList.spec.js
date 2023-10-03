import { mount } from "@vue/test-utils";
import GameList from "@/frontend/components/GameList.vue";
import { BootstrapVue3 } from "bootstrap-vue-3";
import { flushPromises } from "@vue/test-utils";
import testData from "./testData.json";

import axios from "axios";

jest.mock("axios");


it("should display user games", async () => {
    axios.get.mockResolvedValueOnce({ data: [testData.juneGame, testData.releasedGame] });

    const wrapper = await mount(GameList, {
        global: {
            plugins: [BootstrapVue3],
            provide: {
                user: { id: "y1xx" },
                userId: "y1xx",
                gameListId: { gameListId: "test" },
            },
        },
        props: {
            userId: "y1xx",
        },
    });

    await flushPromises();

    expect(wrapper.find("#game-" + testData.juneGame.id).exists()).toBeTruthy();
});

it("should display games from given list", async () => {
    axios.get = jest.fn((url, request) => {
        if (request.params.listId === "default") {
            return Promise.resolve({ data: [testData.releasedGame] });
        } else if (request.params.listId === "archive") {
            return Promise.resolve({ data: [testData.juneGame] });
        }
    });

    const wrapper = await mount(GameList, {
        global: {
            plugins: [BootstrapVue3],
            provide: {
                user: { id: "y1xx" },
                userId: "y1xx",
                gameListId: { gameListId: "test" },
            },
        },
        props: {
            userId: "y1xx",
            gameListId: "archive",
        },
    });

    await flushPromises();

    expect(wrapper.find("#game-" + testData.juneGame.id).exists()).toBeTruthy();

    const wrapper2 = await mount(GameList, {
        global: {
            plugins: [BootstrapVue3],
            provide: {
                user: { id: "y1xx" },
                userId: "y1xx",
                gameListId: { gameListId: "test" },
            },
        },
        props: {
            userId: "y1xx",
            gameListId: "default",
        },
    });

    await flushPromises();

    expect(wrapper2.find("#game-" + testData.releasedGame.id).exists()).toBeTruthy();

    jest.clearAllMocks();
});

it("should display button 'Back To List' in archive which switches list to default", async () => {
    const wrapper = await mount(GameList, {
        global: {
            plugins: [BootstrapVue3],
            provide: {
                user: { id: "y1xx" },
                userId: "y1xx",
                gameListId: { gameListId: "test" },
            },
        },
        props: {
            userId: "y1xx",
            gameListId: "archive",
        },
    });

    await flushPromises();

    expect(wrapper.find("[data-test='change-list-default']").exists()).toBeTruthy();
    wrapper.find("[data-test='change-list-default']").trigger("click");

    expect(wrapper.emitted("change-list")).toBeTruthy();
    expect(wrapper.emitted("change-list")[0]).toStrictEqual(["default"]);
});


