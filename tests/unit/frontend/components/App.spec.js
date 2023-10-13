import { mount, flushPromises } from "@vue/test-utils";
import Index from "@/frontend/views/Index.vue";
import axios from "axios";
import testData from "./GameList/testData.json";
import { BootstrapVue3 } from "bootstrap-vue-3";
import { setDefaultGrouping } from "@/frontend/library/groupings.js";

jest.mock("axios");

it("renders correctly with released unreleased grouping", async () => {

    axios.get.mockResolvedValueOnce({ data: [testData.futureGame, testData.nextYearGame, testData.juneGame, testData.releasedGame] });

    const wrapper = await mount(Index, {
        global: {
            plugins: [BootstrapVue3],
            provide: {
                isAuthenticated: true,
                user: { value: { id: "y1xx" }, id: "y1xx" },
            },
        },
    });

    await flushPromises();

    expect(wrapper.html()).toMatchSnapshot();
});

it("renders correctly with monthly grouping", async () => {
    setDefaultGrouping("months");
    axios.get.mockResolvedValueOnce({ data: [testData.futureGame, testData.nextYearGame, testData.juneGame, testData.releasedGame] });

    const wrapper = await mount(Index, {
        global: {
            plugins: [BootstrapVue3],
            provide: {
                isAuthenticated: true,
                user: { value: { id: "y1xx" }, id: "y1xx" },
            },
        },
    });

    await flushPromises();

    expect(wrapper.html()).toMatchSnapshot();
});