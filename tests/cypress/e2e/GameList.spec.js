/* eslint-disable sonarjs/no-duplicate-string */
import userGames from "../fixtures/userGames.json";
import platformDisplay from "../../../src/frontend/assets/platforms.json";

//ToDo: Get rid of Test fixture for individual data tests
//ToDo: individual test for custom selector
//ToDo: Test for platform not in platforms.json
describe("Game List Tests", () => {
    it("should display release date of games or TBD", () => {
        const now = new Date(Date.UTC(2022, 5, 1)).getTime();
        cy.clock(now);

        cy.mockLoginRequests();
        cy.mockGetGameListRequest();

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
        cy.wait(2000);

        cy.get("#game-" + userGames[2].id + " [data-cy='delete-game']").click();
        cy.wait("@getUserGames");
        cy.get("#game-" + deletedGameId).should("not.exist");
    });

    it("should sort games by date and seperate into released and unreleased", () => {
        cy.mockLoginRequests();
        cy.mockGetGameListRequest();

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

    it.only("should show platforms on release date and select platform", () => {
        cy.mockLoginRequests();
        cy.mockGetGameListRequest();

        const now = new Date(Date.UTC(2022, 5, 1)).getTime();
        cy.clock(now);

        cy.visit("/");
        cy.wait("@getUserGames");
        cy.removeBootstrapOverlay();
        cy.get(".list-category").click({ multiple: true });

        cy.get("[data-cy='platforms-" + userGames[2].id + "']").should(($platforms) => {
            userGames[2].release_dates.forEach((releaseDate) => {
                expect($platforms[0].innerText).to.contain(
                    releaseDate.platform[
                        platformDisplay.find((element) => element.id === releaseDate.platform.id).selector
                    ],
                );
            });
        });

        cy.get("[data-cy='platforms-" + userGames[3].id + "'] .PC").should("have.not.class", "selected");

        cy.get("[data-cy='platforms-" + userGames[3].id + "'] .PC").click();
        cy.get("[data-cy='platforms-" + userGames[3].id + "'] .PC").should("have.class", "selected");

        cy.get("[data-cy='platforms-" + userGames[3].id + "'] .XSX").click();
        cy.get("[data-cy='platforms-" + userGames[3].id + "'] .PC").should("have.not.class", "selected");
        cy.get("[data-cy='platforms-" + userGames[3].id + "'] .XSX").should("have.class", "selected");

        cy.get("[data-cy='platforms-" + userGames[3].id + "'] .XSX").click();
        cy.get("[data-cy='platforms-" + userGames[3].id + "'] .XSX").should("have.not.class", "selected");
        cy.get("[data-cy='platforms-" + userGames[3].id + "'] .PC").should("have.not.class", "selected");
    });
});
