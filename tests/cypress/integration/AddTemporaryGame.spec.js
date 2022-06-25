describe("add temporary game tests", () => {
    beforeEach(() => {
        const now = new Date(Date.UTC(2022, 5, 1)).getTime();
        cy.clock(now);

        cy.intercept("/api/access", { id: "y1xx" });
        cy.intercept("GET", "/api/user/*/games", { fixture: "userGames.json" }).as("getUserGames");
        cy.intercept("https://accounts.google.com/gsi/client", {});
    });

    it("should add temporary game to database and game list", () => {
        cy.intercept("POST", "/api/game", {}).as("postTemporaryGame");
        cy.intercept("POST", "/api/user/*/games", {}).as("postUserGame");

        cy.visit("/");
        cy.wait("@getUserGames");
        cy.removeBootstrapOverlay();

        cy.get("[data-cy='add-temp-game']").click();

        cy.get("[data-cy='temp-game-name'").type("Temporary Test game");
        //cy.get("[data-cy='temp-game-release-date'");
        cy.get("[data-cy='add-temp-game-to-list']").click();

        cy.wait("@postTemporaryGame").then((interception) => {
            expect(interception.request.body.id).to.not.be.empty;
            expect(interception.request.body.name).to.equal("Temporary Test game");
        });

        cy.wait("@postUserGame").then((interception) => {
            cy.get("#game-" + interception.request.body[0]);
        });

        cy.get("[data-cy='temp-game-name'").should("not.exist");
    });
});
