import GameList from "@/frontend/components/GameList";
import { screen, render, waitFor } from "@testing-library/vue";
import "@testing-library/jest-dom";
import { mockApi } from "../mockApi";

jest.mock("axios");

it("should render game info", async () => {
    const api = mockApi();
    const gameList = api.getEndpointResponseData("/api/user/y1xx/games", "GET");

    render(GameList);

    await waitFor(() => {
        gameList.forEach((game) => {
            expect(screen.getByText(game.name));
            expect(
                screen.getByText(game.involved_companies.find((company) => company.developer).company.name)
            ).toBeVisible();
            const releaseDate = new Date(game.first_release_date * 1000);
            expect(screen.getByText(releaseDate.toLocaleDateString())).toBeVisible();
        });
    });
});

it("should render cover if it exists", async () => {
    const api = mockApi();
    const gameList = api.getEndpointResponseData("/api/user/y1xx/games", "GET");

    render(GameList);

    await waitFor(() => {
        expect(screen.getByTestId("game-" + gameList[0].id + "-cover")).toBeVisible();
        expect(screen.queryByTestId("game-" + gameList[1].id + "-cover")).not.toBeInTheDocument();
    });
});

it("should sort games by release date in ascending order", async () => {
    mockApi();

    render(GameList);

    await waitFor(() => {
        const releaseDates = screen.getAllByTestId("release-date").map((node) => {
            return new Date(node.textContent);
        });
        const isSorted = releaseDates.every((releaseDate, index) => {
            if (releaseDates[index + 1]) {
                return releaseDate <= releaseDates[index + 1];
            } else {
                return true;
            }
        });

        expect(isSorted).toBeTruthy();
    });
});
