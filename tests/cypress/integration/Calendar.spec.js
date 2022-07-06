describe("Calendar Tests", () => {
    it("should return a calendar subscription link", () => {
        const now = new Date(Date.UTC(2022, 5, 1)).getTime();
        cy.clock(now);

        const calendarApiEndpoint = "http://localhost:8080/api/user/y1xx/calendar";
        const token = "213dawd124fs";

        cy.intercept("/api/access", { id: "y1xx" });
        cy.intercept("/api/user/*/games", { fixture: "userGames.json" }).as("getUserGames");
        cy.intercept("https://accounts.google.com/gsi/client", {});
        cy.intercept("/api/user/*/calendars", [{ token: "test123" }, { list: "default", token }]).as("getUserCalendar");

        cy.visit("/");
        cy.wait("@getUserGames");
        cy.removeBootstrapOverlay();

        cy.get("[data-cy='get-calendar']").click();
        cy.wait("@getUserCalendar");

        cy.get("[data-cy='calendar-link']")
            .should("have.value", calendarApiEndpoint + "?token=" + token)
            .and("have.attr", "disabled");
        cy.get("[data-cy='get-calendar-link']").should("not.exist");

        cy.get("[data-cy='download-calendar']").should("have.attr", "download");
    });
});
