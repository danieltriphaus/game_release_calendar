import { screen, render, fireEvent, waitFor } from "@testing-library/vue";
import "@testing-library/jest-dom";

import Calendar from "@/frontend/views/Calendar.vue";

import axios from "axios";

jest.mock("axios");

it("should create calendar and show link", async () => {
    render(Calendar);

    axios.post.mockResolvedValueOnce({ data: "testToken" });

    await fireEvent.update(screen.getAllByPlaceholderText("Password"), "testPassword");
    await fireEvent.click(screen.getByTestId("create-calendar"));

    await waitFor(() => {
        expect(screen.getByText(window.location.href + "api/user/undefined/calendar?token=testToken")).toBeVisible();
    });
});

it("should not show link on page load", () => {
    render(Calendar);

    expect(screen.getByTestId("calendar-link")).toBeEmptyDOMElement();
});

it("should not show link if no token is returned", async () => {
    render(Calendar);

    axios.post.mockResolvedValueOnce({ data: {} });

    await fireEvent.update(screen.getAllByPlaceholderText("Password"), "testPassword");
    await fireEvent.click(screen.getByTestId("create-calendar"));

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
        expect(screen.getByTestId("calendar-link")).toBeEmptyDOMElement();
    });
});

it("should not show link if api does not return 200", async () => {
    render(Calendar);

    axios.post.mockRejectedValueOnce({ response: { status: 401, data: { error: "unauthorized" } } });

    await fireEvent.update(screen.getAllByPlaceholderText("Password"), "testPassword");
    await fireEvent.click(screen.getByTestId("create-calendar"));

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
        expect(screen.getByTestId("calendar-link")).toBeEmptyDOMElement();
    });
});
