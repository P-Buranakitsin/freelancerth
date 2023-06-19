describe("Authentication Flow", () => {
  it("login", () => {
    cy.intercept("/api/auth/session", { fixture: "session.json" }).as("session");

    // Set the cookie for cypress.
    // It has to be a valid cookie so next-auth can decrypt it and confirm its validity.
    // This step can probably/hopefully be improved.
    // We are currently unsure about this part.
    // We need to refresh this cookie once in a while.
    // We are unsure if this is true and if true, when it needs to be refreshed.
    cy.setCookie("next-auth.session-token", "a valid cookie from your browser session");
    // Visit a route in order to allow cypress to actually set the cookie
    cy.visit(Cypress.env("SITE_NAME"));
    // Wait until the intercepted request is ready
    cy.wait("@session");
    // This is where you can now add assertions
    // Example: provide a data-test-id on an element.
    // This can be any selector that "always and only" exists when the user is logged in
    cy.get("[data-test-id='authenticated']").should("exist").then(() => {
      cy.log("Cypress login successful");
    });
  });

});