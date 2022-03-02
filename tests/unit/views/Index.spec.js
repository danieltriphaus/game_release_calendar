import { render, screen, waitFor, fireEvent } from "@testing-library/vue";
import "@testing-library/jest-dom";

import Index from "@/frontend/views/Index";
import axios from "axios";

jest.mock("axios");

it("should render apiKey input if user is not authenticated", () => {
    axios.get.mockRejectedValueOnce({ response: { status: 401 } });

    render(Index);

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining("/access"));
    expect(screen.getByPlaceholderText("API Key")).toBeVisible();
});

it("should render search input if api_key is valid", async () => {
    axios.get.mockResolvedValueOnce({ status: 200 });

    render(Index);

    await waitFor(() => {
        expect(screen.queryByPlaceholderText("API Key")).toBeFalsy();
        expect(screen.queryByText("Senden")).toBeFalsy();
    });

    await waitFor(() => {
        expect(screen.queryByPlaceholderText("Suche Game")).toBeVisible();
    });
});

it("should render search input if valid api key is sent", async () => {
    axios.get.mockRejectedValueOnce({ response: { status: 401 } });
    axios.post.mockResolvedValueOnce({ status: 200 });

    render(Index);

    await fireEvent.update(screen.getByPlaceholderText("API Key"), "test_api_key");
    await fireEvent.click(screen.getByTestId("api-validate"));

    await waitFor(() => {
        expect(screen.queryByPlaceholderText("API Key")).toBeFalsy();
        expect(screen.queryByText("Senden")).toBeFalsy();
    });

    await waitFor(() => {
        expect(screen.queryByPlaceholderText("Suche Game")).toBeVisible();
    });
});

it("should render search input if valid api key is sent", async () => {
    axios.get.mockRejectedValueOnce({ response: { status: 401 } });
    axios.post.mockResolvedValueOnce({ response: { status: 401 } });

    render(Index);

    await fireEvent.update(screen.getByPlaceholderText("API Key"), "test_api_key");
    await fireEvent.click(screen.getByTestId("api-validate"));

    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
    });

    await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(expect.stringContaining("/access"));
        expect(screen.getByPlaceholderText("API Key")).toBeVisible();
    });
});
