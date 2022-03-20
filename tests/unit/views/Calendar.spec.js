import { screen, render, fireEvent, waitFor } from "@testing-library/vue";
import "@testing-library/jest-dom";

import Calendar from "@/frontend/views/Calendar.vue";

import axios from "axios";

jest.mock("axios");

it("should create calendar and show link", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(Calendar);

    axios.post.mockResolvedValueOnce({ data: "testToken" });

    await fireEvent.update(screen.getAllByPlaceholderText("Password"), "testPassword");
    await fireEvent.click(screen.getByTestId("create-calendar"));

    await waitFor(() => {
        expect(
            screen.getByText("/api/user/" + process.env.VUE_APP_DEFAULT_USER + "/calendar?token=testToken", {
                exact: false,
            })
        ).toBeVisible();
    });
});

it("should not show link on page load", () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(Calendar);

    expect(screen.queryByTestId("calendar-link")).not.toBeInTheDocument();
});

it("should not show link if no token is returned", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(Calendar);

    axios.post.mockResolvedValueOnce({ data: {} });

    await fireEvent.update(screen.getAllByPlaceholderText("Password"), "testPassword");
    await fireEvent.click(screen.getByTestId("create-calendar"));

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
        expect(screen.queryByTestId("calendar-link")).not.toBeInTheDocument();
    });
});

it("should not show link if api does not return 200", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(Calendar);

    axios.post.mockRejectedValueOnce({ response: { status: 401, data: { error: "unauthorized" } } });

    await fireEvent.update(screen.getAllByPlaceholderText("Password"), "testPassword");
    await fireEvent.click(screen.getByTestId("create-calendar"));

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
        expect(screen.queryByTestId("calendar-link")).not.toBeInTheDocument();
    });
});

it("should show user calendar links", async () => {
    const calendars = [
        {
            createdAt: new Date("2022-03-19T12:35:56.866Z"),
            igdbAccessToken: "test_access_token",
            token: "test_calendar_token_01",
        },
        {
            createdAt: new Date("2022-03-19T12:35:17.903Z"),
            igdbAccessToken: "test_access_token",
            token: "test_calendar_token_02",
        },
    ];
    axios.get.mockResolvedValueOnce({ data: calendars });

    render(Calendar);

    await waitFor(() => {
        expect(
            screen.getByText(
                "/api/user/" + process.env.VUE_APP_DEFAULT_USER + "/calendar?token=" + calendars[0].token,
                {
                    exact: false,
                }
            )
        ).toBeVisible();
    });
});
