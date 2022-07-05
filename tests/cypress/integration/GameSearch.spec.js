import gameSearch from "../fixtures/gameSearch.json";

describe("Game Search Tests", () => {
    it("should display release date of games or TBA", () => {
        cy.intercept("/api/access", { id: "y1xx" });
        cy.intercept("/api/game/search*", { fixture: "gameSearch.json" }).as("gameSearch");
        cy.intercept("https://accounts.google.com/gsi/client", {});

        cy.visit("/");

        cy.get("[data-cy='search-games']").type("ghostwire");

        cy.get("[data-cy='game-search-spinner']");
        cy.wait("@gameSearch");

        gameSearch.forEach((game) => {
            cy.get("[data-cy='result-" + game.id + "'] [data-cy='release-date']")
                .invoke("text")
                .should("match", /\d|TBD/);
        });
    });

    it("should add game to list if clicked", () => {
        cy.intercept("/api/access", { id: "y1xx" });
        cy.intercept("/api/user/*/games", { fixture: "userGames.json" });
        cy.intercept("https://accounts.google.com/gsi/client", {});

        cy.intercept("/api/game/search*", { fixture: "gameSearch.json" }).as("gameSearch");
        cy.intercept("POST", "/api/user/games", {});

        cy.visit("/");

        cy.get("[data-cy='search-games']").type("ghostwire");
        cy.get("[data-cy='game-search-spinner']");
        cy.wait("@gameSearch");

        cy.get("[data-cy='result-91724']").click();

        cy.get("#game-91724");
    });
});
