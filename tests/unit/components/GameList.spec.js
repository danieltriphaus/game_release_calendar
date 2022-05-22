import GameList from "@/frontend/components/GameList";
import { screen, render, waitFor } from "@testing-library/vue";
import "@testing-library/jest-dom";
import { mockApi } from "../mockApi";

jest.mock("axios");

it("should render game info", async () => {
    const api = mockApi();
    const gameList = api.getEndpointResponseData("/api/user/y1xx/games", "GET");

    render(GameList, { props: { userId: "y1xx" } });

    await waitFor(() => {
        gameList.forEach((game) => {
            expect(screen.getByText(game.name));
            expect(
                screen.getByText(game.involved_companies.find((company) => company.developer).company.name)
            ).toBeVisible();
        });
        screen.getAllByTestId("release-date").forEach((node) => {
            expect(node).not.toBeEmptyDOMElement();
            expect(node.textContent).toMatch(/\d|TBA/);
        });
    });
});

it("should render cover if it exists", async () => {
    const api = mockApi();
    const gameList = api.getEndpointResponseData("/api/user/y1xx/games", "GET");

    render(GameList, { props: { userId: "y1xx" } });

    await waitFor(() => {
        expect(screen.getByTestId("game-" + gameList[0].id + "-cover")).toBeVisible();
        expect(screen.queryByTestId("game-" + gameList[1].id + "-cover")).not.toBeInTheDocument();
    });
});
