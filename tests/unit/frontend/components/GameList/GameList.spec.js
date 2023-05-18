import { mount } from "@vue/test-utils";
import GameList from "@/frontend/components/GameList.vue";
import { BootstrapVue3 } from "bootstrap-vue-3";

import axios from "axios";

jest.mock("axios");


it("should display user games", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    const wrapper = await mount(GameList, {
        global: {
            plugins: [BootstrapVue3],
            provide: {
                user: { id: "y1xx" },
                userId: "y1xx",
            },
        },
        props: {
            userId: "y1xx",
        },
    });

    expect(wrapper).toBeTruthy();
});