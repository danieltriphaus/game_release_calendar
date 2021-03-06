import userGames from "../fixtures/userGames.json";

describe("Game List Tests", () => {
    it("should display release date of games or TBD", () => {
        const now = new Date(Date.UTC(2022, 5, 1)).getTime();
        cy.clock(now);

        cy.intercept("/api/access", { id: "y1xx" });
        cy.intercept("/api/user/*/games", { fixture: "userGames.json" }).as("getUserGames");
        cy.intercept("https://accounts.google.com/gsi/client", {});

        cy.visit("/");
        cy.wait("@getUserGames");
        cy.removeBootstrapOverlay();
        cy.get(".list-category").click({ multiple: true });

        userGames.forEach((game) => {
            cy.get("#game-" + game.id + " .release-date")
                .invoke("text")
                .should("match", /\d|TBD/);
        });
    });

    it("should delete game from list if delete button clicked", () => {
        const now = new Date(Date.UTC(2022, 5, 1)).getTime();
        cy.clock(now);

        cy.intercept("/api/access", { id: "y1xx" });
        const userGamesCopy = [...userGames];
        const deletedGameId = userGames[2].id;

        cy.intercept("/api/user/*/games", (req) => {
            req.alias = "getUserGames";
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
        cy.wait("@getUserGames");
        cy.removeBootstrapOverlay();
        cy.get(".list-category").click({ multiple: true });

        cy.get("#game-" + userGames[2].id + " [data-cy='delete-game']").click();
        cy.wait("@getUserGames");
        cy.get("#game-" + deletedGameId).should("not.exist");
    });

    it("should sort games by date and seperate into released and unreleased", () => {
        cy.intercept("/api/access", { id: "y1xx" });
        cy.intercept("/api/user/*/games", { fixture: "userGames.json" }).as("getUserGames");
        cy.intercept("https://accounts.google.com/gsi/client", {});

        const now = new Date(Date.UTC(2022, 5, 1)).getTime();
        cy.clock(now);

        cy.visit("/");
        cy.wait("@getUserGames");
        cy.removeBootstrapOverlay();
        cy.get(".list-category").click({ multiple: true });

        cy.get("[data-cy='released-games'] [data-cy='release-date']").should(($releaseDate) => {
            expect(Date.parse($releaseDate[0].textContent))
                .to.be.lessThan(Date.parse($releaseDate[1].textContent))
                .and.to.be.lessThan(now);
        });

        cy.get("[data-cy='unreleased-games'] [data-cy='release-date']").should(($releaseDate) => {
            expect(Date.parse($releaseDate[0].textContent))
                .to.be.lessThan(Date.parse($releaseDate[1].textContent))
                .and.to.be.greaterThan(now);
        });
    });
});
