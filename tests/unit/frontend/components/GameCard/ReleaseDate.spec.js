/* eslint-disable sonarjs/no-duplicate-string */
import { mount } from "@vue/test-utils";
import GameCard from "@/frontend/components/GameCard.vue";

jest.mock("axios");

it("should display release date category 0 in locale string", async () => {
    const game = {
        id: 45,
        name: "Fake Game",
        first_release_date: (new Date("October 15, 2020")).getTime() / 1000,
        release_dates: [
            { date: (new Date("October 15, 2020")).getTime() / 1000, category: 0 },
        ],
    };

    const wrapper = await mountGameCard(game);

    expect(wrapper.find(".release-date").text()).toBe(getFormattedDate(new Date(game.release_dates[0].date * 1000)));
});

it("should display human readable release date if not category 0", async () => {
    const game = {
        id: 45,
        name: "Fake Game",
        first_release_date: (new Date("October 1, 2020")).getTime() / 1000,
        release_dates: [
            { date: (new Date("October 1, 2020")).getTime() / 1000, category: 1, human: "Q4 2020" },
        ],
    };

    const wrapper = await mountGameCard(game);

    expect(wrapper.find(".release-date").text()).toBe(game.release_dates[0].human);
});

it("should display TBD  without release dates", async () => {
    const game = {
        id: 45,
        name: "Fake Game",
    };

    const wrapper = await mountGameCard(game);

    expect(wrapper.find(".release-date").text()).toBe("TBD");
});

it("should display first_release_date with multiple release dates and no platform selected", async () => {
    const game = {
        id: 45,
        name: "Fake Game",
        first_release_date: (new Date("October 1, 2020")).getTime() / 1000,
        release_dates: [
            { date: (new Date("October 1, 2022")).getTime() / 1000, category: 1, human: "Q4 2022" },
            { date: (new Date("October 1, 2020")).getTime() / 1000, category: 1, human: "Q4 2020" },
        ],
    };

    const wrapper = await mountGameCard(game);

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

    const wrapper = await mountGameCard(game);

    const platformsList = wrapper.find(".platforms").text();
    expect(platformsList).toContain("XSX");
    expect(platformsList).toContain("PC");
    expect(platformsList).toContain("PSVR");
});

it("should display selected platform release date", async () => {
    const game = {
        id: 45,
        name: "Fake Game",
        first_release_date: (new Date("October 1, 2020")).getTime() / 1000,
        release_dates: [
            { date: (new Date("October 1, 2020")).getTime() / 1000, category: 0, platform: { id: 165, name: "Playstation VR" } },
            { date: (new Date("August 1, 2022")).getTime() / 1000, category: 0, platform: { id: 169, alternative_name: "XSX", name: "XBox Series X|S" } },
            { date: (new Date("November 2, 2020")).getTime() / 1000, category: 0, platform: { id: 6, abbreviation: "PC", name: "PC" } },
        ],
    };

    const wrapper = await mountGameCard(game);

    expect(wrapper.find(".release-date").text()).toBe(getFormattedDate(new Date(game.release_dates[0].date * 1000)));

    await wrapper.get(".PC").trigger("click");

    expect(wrapper.find(".release-date").text()).toBe(getFormattedDate(new Date(game.release_dates[2].date * 1000)));

    await wrapper.get(".PC").trigger("click");

    expect(wrapper.find(".release-date").text()).toBe(getFormattedDate(new Date(game.release_dates[0].date * 1000)));
});

async function mountGameCard(game) {
    return await mount(GameCard, {
        props: {
            game,
        },
        global: {
            provide: { user: { value: { id: "y1xx" } } },
        },
    });
}

function getFormattedDate(date) {
    return date.toLocaleDateString(navigator.language, { year: "numeric", month: "2-digit", day: "2-digit" });
}
