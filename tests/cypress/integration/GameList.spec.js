import userGames from "../fixtures/userGames.json";

describe("Game List Tests", () => {
    it("should display release date of games or TBA", () => {
        const now = new Date(Date.UTC(2022, 5, 1)).getTime();
        cy.clock(now);

        cy.intercept("/api/access", { id: "y1xx" });
        cy.intercept("/api/user/*/games", { fixture: "userGames.json" });
        cy.intercept("https://accounts.google.com/gsi/client", {});

        cy.visit("/");

        userGames.forEach((game) => {
            cy.get("#game-" + game.id + " .release-date")
                .invoke("text")
                .should("match", /\d|TBA/);
        });
    });

    it("should delete game from list if delete button clicked", () => {
        const now = new Date(Date.UTC(2022, 5, 1)).getTime();
        cy.clock(now);

        cy.intercept("/api/access", { id: "y1xx" });
        const userGamesCopy = [...userGames];
        const deletedGameId = userGames[2].id;

        cy.intercept("/api/user/*/games", (req) => {
            req.alias = "getGames";
            req.reply(userGamesCopy);
        });
        cy.intercept("https://accounts.google.com/gsi/client", {});
        cy.intercept("DELETE", "/api/user/*/games", (req) => {
            req.alias = "deleteGame";

            expect(req.body).to.include(userGames[2].id);
            userGamesCopy.splice(2, 1);
            req.reply({});
        });

        cy.visit("/");

        cy.get("#game-" + userGames[2].id + " [data-cy='delete-game']").click();
        cy.wait("@getGames");
        cy.get("#game-" + deletedGameId).should("not.exist");
    });

    it("should sort games by date and seperate into released and unreleased", () => {
        cy.intercept("/api/access", { id: "y1xx" });
        cy.intercept("/api/user/*/games", { fixture: "userGames.json" });
        cy.intercept("https://accounts.google.com/gsi/client", {});

        const now = new Date(Date.UTC(2022, 5, 1)).getTime();
        cy.clock(now);

        cy.visit("/");

        cy.get("[data-cy='released-games'] [data-cy='game-title']")
            .first()
            .invoke("text")
            .should("equal", "Uncharted: Legacy of Thieves Collection");

        cy.get("[data-cy='unreleased-games'] [data-cy='game-title']")
            .first()
            .invoke("text")
            .should("equal", "The Quarry");
    });
});
