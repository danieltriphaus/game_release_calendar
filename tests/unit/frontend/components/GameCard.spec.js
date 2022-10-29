/* eslint-disable sonarjs/no-duplicate-string */
import { mount } from "@vue/test-utils";
import GameCard from "@/frontend/components/GameCard.vue";

jest.mock("axios");


it("should display release date category 0 in locale string", () => {
    const game = {
        id: 45,
        name: "Fake Game",
        first_release_date: (new Date("October 15, 2020")).getTime() / 1000,
        release_dates: [
            { date: (new Date("October 15, 2020")).getTime() / 1000, category: 0 },
        ],
    };

    const wrapper = mount(GameCard, {
        props: {
            game,
        },
    });

    expect(wrapper.find(".release-date").text()).toBe(new Date(game.release_dates[0].date * 1000).toLocaleDateString());
});

it("should display human readable release date if not category 0", () => {
    const game = {
        id: 45,
        name: "Fake Game",
        first_release_date: (new Date("October 1, 2020")).getTime() / 1000,
        release_dates: [
            { date: (new Date("October 1, 2020")).getTime() / 1000, category: 1, human: "Q4 2020" },
        ],
    };

    const wrapper = mount(GameCard, {
        props: {
            game,
        },
    });

    expect(wrapper.find(".release-date").text()).toBe(game.release_dates[0].human);
});

it("should display TBD  without release dates", () => {
    const game = {
        id: 45,
        name: "Fake Game",
    };

    const wrapper = mount(GameCard, {
        props: {
            game,
        },
    });

    expect(wrapper.find(".release-date").text()).toBe("TBD");
});

it("should display first_release_date with multiple release dates and no platform selected", () => {
    const game = {
        id: 45,
        name: "Fake Game",
        first_release_date: (new Date("October 1, 2020")).getTime() / 1000,
        release_dates: [
            { date: (new Date("October 1, 2022")).getTime() / 1000, category: 1, human: "Q4 2022" },
            { date: (new Date("October 1, 2020")).getTime() / 1000, category: 1, human: "Q4 2020" },
        ],
    };

    const wrapper = mount(GameCard, {
        props: {
            game,
        },
    });

    expect(wrapper.find(".release-date").text()).toBe(game.release_dates[1].human);
});

it("should display platforms with release dates", async () => {
    const game = {
        id: 45,
        name: "Fake Game",
        first_release_date: (new Date("October 1, 2020")).getTime() / 1000,
        release_dates: [
            { date: (new Date("October 1, 2022")).getTime() / 1000, category: 1, human: "Q4 2022", platform: { id: 169, alternative_name: "XSX", name: "XBox Series X|S" } },
            { date: (new Date("October 1, 2020")).getTime() / 1000, category: 1, human: "Q4 2020", platform: { id: 6, abbreviation: "PC", name: "PC" } },
            { date: (new Date("October 1, 2020")).getTime() / 1000, category: 1, human: "Q4 2020", platform: { id: 165, name: "Playstation VR" } },
        ],
    };

    const wrapper = await mount(GameCard, {
        props: {
            game,
        },
    });

    const platformsList = wrapper.find(".platforms").text();
    expect(platformsList).toContain("XSX");
    expect(platformsList).toContain("PC");
    expect(platformsList).toContain("PSVR");
});