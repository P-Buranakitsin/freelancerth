describe("Authentication Flow", () => {
  before(() => {
    // Clear previous sessions before logging in
    Cypress.session.clearAllSavedSessions();
  })

  it("login", () => {
    // Call your custom cypress command
    cy.login();
    // Visit a route in order to allow cypress to actually set the cookie
    cy.visit("/");
    // Wait until the intercepted request is ready
    cy.wait("@session");

    // Assert that user is really logged in
    cy.visit(`auth/new-user`).url().should('include', '/auth/new-user').then(() => {
      cy.log("Cypress login successful");
    })
  });

});