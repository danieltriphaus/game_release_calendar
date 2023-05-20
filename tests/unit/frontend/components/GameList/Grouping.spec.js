import { flushPromises, mount } from "@vue/test-utils";
import GameList from "@/frontend/components/GameList.vue";
import { BootstrapVue3 } from "bootstrap-vue-3";
import { config, setDefaultGrouping } from "@/frontend/library/groupings.js";
import testData from "./testData.json";

import axios from "axios";

jest.mock("axios");

jest.mock("vue-router", () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

function renderGameList(grouping) {
    setDefaultGrouping(grouping);

    return mount(GameList, {
        global: {
            plugins: [BootstrapVue3],
            provide: {
                user: { value: { id: "y1xx" } },
                userId: "y1xx",
            },
        },
        props: {
            userId: "y1xx",
        },
    });
}

beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2023-06-01T00:00:00.000Z"));
    window.localStorage.clear();
});

it("should display released_unreleased grouping", async () => {
    axios.get.mockResolvedValueOnce({ data: [testData.unreleasedGame, testData.releasedGame] });
    const wrapper = renderGameList("released_unreleased");

    const categoryIds = config.groupings.released_unreleased.map((category) => category.id);
    await flushPromises();

    expect(wrapper.find("#" + categoryIds[0]).exists()).toBe(true);
    expect(wrapper.find("#" + categoryIds[1]).exists()).toBe(true);
});

it("should display monthly grouping", async () => {
    axios.get.mockResolvedValueOnce({ data: [testData.juneGame] });

    const wrapper = renderGameList("months");

    await flushPromises();

    expect(wrapper.find("#june").exists()).toBe(true);
});

it("should group edge cases correctly", async () => {
    axios.get.mockResolvedValueOnce({ data: [testData.pastGame, testData.futureGame, testData.nextYearGame, testData.thisYearGame, testData.tdbGame] });
    const wrapper = renderGameList("months");

    await flushPromises();

    expect(wrapper.find("#tbd #game-" + testData.tdbGame.id).exists()).toBe(true);
    expect(wrapper.find("#future #game-" + testData.futureGame.id).exists()).toBe(true);
    expect(wrapper.find("#future #game-" + testData.nextYearGame.id).exists()).toBe(true);
    expect(wrapper.find("#year-2023 #game-" + testData.thisYearGame.id).exists()).toBe(true);
});

it("should switch grouping when user changes it", async () => {
    axios.get.mockResolvedValueOnce({ data: [testData.unreleasedGame, testData.releasedGame, testData.juneGame] });
    const wrapper = renderGameList("released_unreleased");

    const categoryIds = config.groupings.released_unreleased.map((category) => category.id);
    await flushPromises();

    expect(wrapper.find("#" + categoryIds[0]).exists()).toBe(true);
    expect(wrapper.find("#" + categoryIds[1]).exists()).toBe(true);

    await wrapper.find("[data-test='list-actions'] #grouping").trigger("click");
    await wrapper.find("[data-test='monthly-grouping']").trigger("click");

    expect(wrapper.find("#june").exists()).toBe(true);
});

it("should filter categories without games", async () => {
    axios.get.mockResolvedValueOnce({ data: [testData.juneGame] });
    const wrapper = renderGameList("months");

    await flushPromises();

    expect(wrapper.find("#july").exists()).toBe(false);
});

it("should not show groups if it is disabled", async () => {
    axios.get.mockResolvedValueOnce({ data: [testData.juneGame] });
    const wrapper = renderGameList("no-grouping");

    await flushPromises();

    expect(wrapper.find("#june").exists()).toBe(false);
});



