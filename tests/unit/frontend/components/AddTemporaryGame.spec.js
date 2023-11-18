// @ts-nocheck
import { mount } from "@vue/test-utils";
import AddTemporaryGame from "@/frontend/components/game_list_menu/AddTemporaryGame.vue";
import axios from "axios";
import { nanoid } from "nanoid";
import "isomorphic-fetch";

jest.mock("axios");
jest.mock("nanoid");

const CONTROLS = {
    nameInput: "input[data-test='temp-game-name']",
    cancelButton: "button[data-test='cancel-input']",
    addButton: "button[data-test='add-temp-game']",
};

it("cancel button should clear input", async () => {
    const wrapper = mount(AddTemporaryGame, { global: { provide: { gameListId: { gameListId: "test" } } } });

    const nameInput = wrapper.get(CONTROLS.nameInput);
    await nameInput.setValue("test name");

    expect(nameInput.element.value).toBe("test name");

    const cancelButton = wrapper.get(CONTROLS.cancelButton);
    await cancelButton.trigger("click");

    expect(nameInput.element.value).toBeFalsy();

    nameInput;
});

it("should make api requests to add temporary game and add entry to game list", async () => {
    nanoid.mockReturnValue("TestID");

    const wrapper = mount(AddTemporaryGame, { global: { provide: { userId: { value: "y1xx" }, gameListId: { gameListId: "test" } } } });

    const nameInput = wrapper.get(CONTROLS.nameInput);
    await nameInput.setValue("test name");

    const addButton = wrapper.get(CONTROLS.addButton);
    await addButton.trigger("click");

    expect(JSON.stringify(axios.post.mock.calls[0][1])).toEqual(expect.stringContaining("test name"));
    expect(JSON.stringify(axios.post.mock.calls[1][1])).toEqual(expect.stringContaining("TestID"));
});

it("should emit game-added event and clear name input", async () => {
    nanoid.mockReturnValue("TestID");

    const wrapper = mount(AddTemporaryGame, { global: { provide: { userId: { value: "y1xx" }, gameListId: { gameListId: "test" } } } });

    const nameInput = wrapper.get(CONTROLS.nameInput);
    await nameInput.setValue("test name");

    const addButton = wrapper.get(CONTROLS.addButton);
    await addButton.trigger("click");

    expect(wrapper.emitted()).toHaveProperty("game-added");

    expect(nameInput.element.value).toBeFalsy();
});