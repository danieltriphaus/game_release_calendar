import { mount } from "@vue/test-utils";
import ArchiveControl from "@/frontend/components/ArchiveControl.vue";
import { BootstrapVue3 } from "bootstrap-vue-3";
import axios from "axios";

jest.mock("axios");

it("should archive games even with entries without release dates", async () => {
    const wrapper = mount(ArchiveControl, {
        global: {
            plugins: [BootstrapVue3],
            provide: { user: { value: { id: "123" } }, gameListId: { gameListId: "test" } },
        },
        props: {
            games: [
                { id: 1, name: "Game 1", first_release_date: 1645789317, release_dates: [{ date: 1645789317 }] },
                { id: 2, name: "Game 2", release_dates: [] },
                { id: 3, name: "Game 3" },
            ],
        },
    });

    let archiveButton = wrapper.get("button[data-test='archive-year-2022']");
    await archiveButton.trigger("click");

    expect(wrapper.emitted()).toHaveProperty("delete-game");
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining(""), { games: [{ id: 1 }], listId: "archive" });

    archiveButton = wrapper.get("button[data-test='archive-released']");
    await archiveButton.trigger("click");

    expect(wrapper.emitted()["delete-game"].length).toBe(2);
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining(""), { games: [{ id: 1 }], listId: "archive" });
});