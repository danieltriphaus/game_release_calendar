import GameListMenu from "@/frontend/components/game_list_menu/GameListMenu.vue";
import { mount } from "@vue/test-utils";
import { BootstrapVue3 } from "bootstrap-vue-3";

const temporaryGameMenuItem = "[data-test='list-actions'] #temporary_game";
const temporaryGameMenu = "[data-test='add-temp-game']";

it("should show components if clicked", async () => {
    const wrapper = mount(GameListMenu, {
        global: {
            plugins: [BootstrapVue3],
            provide: {
                user: { value: { id: "y1xx" } },
                userId: "y1xx",
                gameListId: { gameListId: "test" },
            },
        },
    });

    await wrapper.get(temporaryGameMenuItem).trigger("click");

    expect(wrapper.find(temporaryGameMenu).exists()).toBe(true);

    await wrapper.get("[data-test='list-actions'] #calendar").trigger("click");

    expect(wrapper.find("[data-test='calendar']").exists()).toBe(true);

    await wrapper.get("[data-test='list-actions'] #archive").trigger("click");

    expect(wrapper.find("[data-test='archive']").exists()).toBe(true);
});

it("should hide component if active item is clicked again", async () => {
    const wrapper = mount(GameListMenu, {
        global: {
            provide: {
                user: { id: "y1xx", value: { id: "y1xx" } },
                gameListId: { gameListId: "test" },
            },
            plugins: [BootstrapVue3],
        },
    });

    await wrapper.get(temporaryGameMenuItem).trigger("click");

    expect(wrapper.find(temporaryGameMenu).exists()).toBeTruthy();

    await wrapper.get(temporaryGameMenuItem).trigger("click");

    expect(wrapper.find(temporaryGameMenu).exists()).toBe(false);
});