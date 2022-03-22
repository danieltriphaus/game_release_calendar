import { render, screen, waitFor, fireEvent } from "@testing-library/vue";
import "@testing-library/jest-dom";

import Index from "@/frontend/views/Index";
import axios from "axios";

jest.mock("axios");

function renderIndexView() {
    render(Index, { global: { stubs: ["router-link"] } });
}

it("should render apiKey input if user is not authenticated", () => {
    axios.get.mockRejectedValueOnce({ response: { status: 401 } });

    renderIndexView();

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining("/access"));
    expect(screen.getByPlaceholderText("API Key")).toBeVisible();
});

it("should render search input if api_key is valid", async () => {
    axios.get.mockResolvedValueOnce({ status: 200 });

    renderIndexView();

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

    renderIndexView();

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

    renderIndexView();

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

const searchResponse = [
    {
        id: 11156,
        cover: { id: 133030, height: 1380, url: "//images.igdb.com/igdb/image/upload/t_thumb/co2una.jpg", width: 1035 },
        first_release_date: 1488240000,
        involved_companies: [
            { id: 24436, company: { id: 1843, name: "Guerrilla Games" }, developer: true },
            { id: 149775, company: { id: 10100, name: "Sony Interactive Entertainment" }, developer: false },
        ],
        name: "Horizon Zero Dawn",
    },
    {
        id: 136150,
        cover: { id: 130754, height: 1080, url: "//images.igdb.com/igdb/image/upload/t_thumb/co2sw2.jpg", width: 810 },
        first_release_date: 1488326400,
        involved_companies: [
            { id: 143054, company: { id: 1843, name: "Guerrilla Games" }, developer: true },
            { id: 143055, company: { id: 45, name: "Sony Computer Entertainment, Inc. (SCEI)" }, developer: false },
        ],
        name: "Horizon Zero Dawn: Limited Edition",
    },
];

it("should display search results when returned from api", async () => {
    axios.get.mockResolvedValueOnce({ status: 200 });

    renderIndexView();

    await waitFor(() => {
        expect(screen.queryByPlaceholderText("API Key")).toBeFalsy();
        expect(screen.queryByText("Senden")).toBeFalsy();
    });

    await waitFor(() => {
        expect(screen.queryByPlaceholderText("Suche Game")).toBeVisible();
    });

    axios.get.mockResolvedValueOnce({ data: searchResponse });

    await fireEvent.update(screen.getByPlaceholderText("Suche Game"), "test query");
    await fireEvent.keyUp(screen.getByPlaceholderText("Suche Game"));

    await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(expect.stringContaining("/game/search"), {
            params: { q: "test query" },
        });
        expect(screen.getByText(searchResponse[0].name)).toBeVisible();
    });

    axios.get.mockResolvedValueOnce({ data: {} });

    await fireEvent.update(screen.getByPlaceholderText("Suche Game"), "");
    await fireEvent.keyUp(screen.getByPlaceholderText("Suche Game"));

    await waitFor(() => {
        expect(screen.queryByText(searchResponse[0].name)).not.toBeInTheDocument();
    });
});

it("should display game without cover", async () => {
    axios.get.mockResolvedValueOnce({ status: 200 });

    renderIndexView();

    await waitFor(() => {
        expect(screen.queryByPlaceholderText("API Key")).toBeFalsy();
        expect(screen.queryByText("Senden")).toBeFalsy();
    });

    await waitFor(() => {
        expect(screen.queryByPlaceholderText("Suche Game")).toBeVisible();
    });

    searchResponse.push({
        id: 11132,
        first_release_date: 1488240000,
        involved_companies: [{ id: 24436, company: { id: 1843, name: "Guerrilla Games" }, developer: true }],
        name: "Game Without Cover",
    });

    axios.get.mockResolvedValueOnce({ data: searchResponse });

    await fireEvent.update(screen.getByPlaceholderText("Suche Game"), "test query");
    await fireEvent.keyUp(screen.getByPlaceholderText("Suche Game"));

    await waitFor(() => {
        expect(screen.getByText(searchResponse[searchResponse.length - 1].name)).toBeVisible();
    });

    searchResponse.pop();
});

it("should send clicked game id to api", async () => {
    axios.get.mockResolvedValueOnce({ status: 200 });

    renderIndexView();

    await waitFor(() => {
        expect(screen.queryByPlaceholderText("API Key")).toBeFalsy();
        expect(screen.queryByText("Senden")).toBeFalsy();
    });

    await waitFor(() => {
        expect(screen.queryByPlaceholderText("Suche Game")).toBeVisible();
    });

    axios.get.mockResolvedValueOnce({ data: searchResponse });

    await fireEvent.update(screen.getByPlaceholderText("Suche Game"), "test query");
    await fireEvent.keyUp(screen.getByPlaceholderText("Suche Game"));

    await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(expect.stringContaining("/game/search"), {
            params: { q: "test query" },
        });
        expect(screen.getByText(searchResponse[0].name)).toBeVisible();
    });

    await fireEvent.click(screen.getByTestId("result-" + searchResponse[0].id));

    await waitFor(() => {
        expect(axios.post).toBeCalledWith(
            expect.stringContaining("/games"),
            expect.arrayContaining([searchResponse[0].id])
        );
    });
});
