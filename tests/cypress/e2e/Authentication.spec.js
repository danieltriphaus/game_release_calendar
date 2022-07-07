describe("Authentication tests End2End requires api server", () => {
    it("should login with auth_key cookie", () => {
        cy.setCookie("auth_key", "ffI4qqbbdAQCBTpuD3F_aAHYVogRRvZ4");

        cy.visit("/");

        cy.get("[data-cy='search-games']");
    });

    it("should not login with wrong auth_key cookie", () => {
        cy.setCookie("auth_key", "wrong");

        cy.visit("/");

        cy.get("[data-cy='search-games']").should("not.exist");
    });
});
