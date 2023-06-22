describe("Authentication Flow", () => {
  before(() => {
    // Clear previous sessions before logging in
    Cypress.session.clearAllSavedSessions();
  })


  it("login", () => {
    // Call your custom cypress command
    cy.login();

    // Assert that user is really logged in by visiting protected route
    cy.visit(`auth/new-user`).url().should('include', '/auth/new-user').then(() => {
      cy.log("Cypress login successful");
    })
  });

});