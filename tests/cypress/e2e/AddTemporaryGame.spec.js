describe("add temporary game tests", () => {
    beforeEach(() => {
        const now = new Date(Date.UTC(2022, 5, 1)).getTime();
        cy.clock(now);

        cy.intercept("/api/access", { id: "y1xx" });
        cy.intercept("GET", "/api/user/*/games", { fixture: "userGames.json" }).as("getUserGames");
        cy.intercept("https://accounts.google.com/gsi/client", {});
    });

    it("should add temporary game to database and game list", () => {
        const tempTitle = "Temporary Test game";
        const tempGameInputSelector = "[data-cy='temp-game-name']";

        cy.intercept("POST", "/api/game", {}).as("postTemporaryGame");
        cy.intercept("POST", "/api/user/*/games", {}).as("postUserGame");

        cy.visit("/");
        cy.wait("@getUserGames");
        cy.removeBootstrapOverlay();

        cy.get(".temporary-game-tab").click();

        cy.get(tempGameInputSelector).type(tempTitle);

        cy.get("[data-cy='add-temp-game-to-list']").click();

        cy.wait("@postTemporaryGame").then((interception) => {
            expect(interception.request.body.id).to.not.be.empty;
            expect(interception.request.body.name).to.equal(tempTitle);
        });

        cy.wait("@postUserGame").then((interception) => {
            cy.get("#game-" + interception.request.body[0].id);
        });
        cy.get(tempGameInputSelector).should("have.value", "");

        cy.get(tempGameInputSelector).type(tempTitle);

        cy.get("[data-test='cancel-input']").click();
        cy.get(tempGameInputSelector).should("have.value", "");

    });
});
