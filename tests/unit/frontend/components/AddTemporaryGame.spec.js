import { mount } from "@vue/test-utils";
import AddTemporaryGame from "@/frontend/components/AddTemporaryGame.vue";

jest.mock("axios");

const CONTROLS = {
    nameInput: "input[data-test='temp-game-name']",
    cancelButton: "button[data-test='cancel-input']",
};

it("cancel button should clear input", async () => {
    const wrapper = mount(AddTemporaryGame);

    const nameInput = wrapper.get(CONTROLS.nameInput);
    await nameInput.setValue("test name");

    const cancelButton = wrapper.get(CONTROLS.cancelButton);
    await cancelButton.trigger("click");

    expect(nameInput.element.value).toBeFalsy();

    nameInput;
});