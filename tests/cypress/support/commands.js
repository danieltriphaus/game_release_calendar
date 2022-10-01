// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add("removeBootstrapOverlay", () => {
    cy.get(".b-overlay").then((elem) => {
        const elemHtml = elem.get(0);
        elemHtml.remove();
    });
});

Cypress.Commands.add("mockLoginRequests", () => {
    cy.intercept("/api/access", { id: "y1xx" });
    cy.intercept("https://accounts.google.com/gsi/client", {});
});

Cypress.Commands.add("mockGetGameListRequest", () => {
    cy.intercept("/api/user/*/games", { fixture: "userGames.json" }).as("getUserGames");
});
