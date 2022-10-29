import { mount } from "@vue/test-utils";
import AddTemporaryGame from "@/frontend/components/AddTemporaryGame.vue";

jest.mock("axios");

const CONTROLS = {
    openButton: "button[data-test='open-temp-game-control']",
    nameInput: "input[data-test='temp-game-name']",
    cancelButton: "button[data-test='cancel-input']",
};

it("should just display button on default", () => {
    const wrapper = mount(AddTemporaryGame);

    expect(wrapper.find(CONTROLS.nameInput).exists()).toBe(false);
    expect(wrapper.get(CONTROLS.openButton).text()).toContain("Game not found?");
});

it("should toggle temporary game inputs and clear them", async () => {
    const wrapper = mount(AddTemporaryGame);

    await wrapper.get(CONTROLS.openButton).trigger("click");

    expect(wrapper.find(CONTROLS.openButton).exists()).toBe(false);
    expect(wrapper.find(CONTROLS.nameInput).exists()).toBe(true);

    await wrapper.get(CONTROLS.cancelButton).trigger("click");

    expect(wrapper.find(CONTROLS.openButton).exists()).toBe(true);
    expect(wrapper.find(CONTROLS.nameInput).exists()).toBe(false);

    await wrapper.get(CONTROLS.openButton).trigger("click");

    expect(wrapper.find(CONTROLS.nameInput));
});