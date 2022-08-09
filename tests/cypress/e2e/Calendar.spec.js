describe("Calendar Tests", () => {
    it("should show calendar subscription link and offer ics download", () => {
        const now = new Date(Date.UTC(2022, 5, 1)).getTime();
        cy.clock(now);

        const calendarApiEndpoint = "http://localhost:8080/api/user/y1xx/calendar";
        const token = "213dawd124fs";

        cy.intercept("/api/access", { id: "y1xx" });
        cy.intercept("/api/user/*/games", { fixture: "userGames.json" }).as("getUserGames");
        cy.intercept("https://accounts.google.com/gsi/client", {});
        cy.intercept({ method: "POST", url: "/api/user/*/calendar" }, { list: "default", token }).as(
            "postUserCalendar",
        );

        cy.intercept({ url: "/api/user/*/calendars*", times: 1 }, { statusCode: 404 }).as("getUserCalendarNotFound");

        cy.visit("/");
        cy.wait("@getUserGames");
        cy.removeBootstrapOverlay();

        cy.get("[data-cy='get-calendar']").click();
        cy.wait("@getUserCalendarNotFound");
        cy.wait("@postUserCalendar");

        cy.get("[data-cy='calendar-link']")
            .should("have.value", calendarApiEndpoint + "?token=" + token)
            .and("have.attr", "disabled");
        cy.get("[data-cy='get-calendar-link']").should("not.exist");

        cy.get("[data-cy='download-calendar']").should("have.attr", "download");

        cy.reload();

        cy.intercept({ url: "/api/user/*/calendars*", times: 1 }, [{ list: "default", token }]).as("getUserCalendar");

        cy.get("[data-cy='get-calendar']").click();

        cy.wait("@getUserCalendar");

        cy.get("[data-cy='calendar-link']")
            .should("have.value", calendarApiEndpoint + "?token=" + token)
            .and("have.attr", "disabled");
        cy.get("[data-cy='get-calendar-link']").should("not.exist");

        cy.get("[data-cy='download-calendar']").should("have.attr", "download");
    });
});
