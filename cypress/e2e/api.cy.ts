describe("PUT /api/user/update", () => {
    it("user not logged in", () => {
      cy.request({
        method: 'PUT',
        url: '/api/user/update', // baseUrl is prepend to URL
        body: {
          name: 'Jane'
        },
        failOnStatusCode: false,
      }).then((response) => {
        // code for unauthorized access is 403
        expect(response.status).to.eq(403)
      })
    })
  
    it("user logged in but no body sent", () => {
      cy.login()
      cy.request({
        method: 'PUT',
        url: '/api/user/update', // baseUrl is prepend to URL
        failOnStatusCode: false,
      }).then((response) => {
        // code for internal server error is 500
        expect(response.status).to.eq(500)
      })
    })
  
    it("user logged in but body only has email", () => {
      cy.login()
      cy.request({
        method: 'PUT',
        url: '/api/user/update', // baseUrl is prepend to URL
        body: {
          email: 'example@email.com'
        },
        failOnStatusCode: false,
      }).then((response) => {
        // code for internal server error is 500
        expect(response.status).to.eq(422)
      })
    })
  
    it("user logged in and body only has name", () => {
      cy.login()
  
      cy.request({
        method: 'PUT',
        url: '/api/user/update', // baseUrl is prepend to URL
        body: {
          name: 'Jane'
        },
        failOnStatusCode: false,
      }).then((response) => {
        // code for invalid input error is 500
        expect(response.status).to.eq(422)
      })
  
    })
  
    it("user logged in, body has both name and email but email does not exist in the database", () => {
      cy.login()
  
      cy.request({
        method: 'PUT',
        url: '/api/user/update', // baseUrl is prepend to URL
        body: {
          name: 'Jane',
          email: 'example@email.com',
        },
        failOnStatusCode: false,
      }).then((response) => {
        // code for no email found error is 400
        expect(response.status).to.eq(400)
      })
    })
  
    it("user logged in, body has both name and email and email exists in the database", () => {
      cy.login()
  
      cy.request({
        method: 'PUT',
        url: '/api/user/update', // baseUrl is prepend to URL
        body: {
          name: 'James Bond',
          email: 'mediqueuea@gmail.com',
        },
        failOnStatusCode: false,
      }).then((response) => {
        // code for no email found error is 400
        expect(response.status).to.eq(200)

        // Assert response sent from backend
        expect(response.body.data.user.name).to.eq("James Bond")
        expect(response.body.data.user.email).to.eq("mediqueuea@gmail.com")
      })
    })
  })