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
import 'cypress-file-upload';

Cypress.Commands.add('login', ({ usr, pwd }) => {
    cy.request({
        method: 'POST',
        url: 'http://localhost:8000/api/method/login', // Adjust URL to your Frappe site
        body: {
            usr,   // Replace with your actual username
            pwd    // Replace with your actual password
        }
    }).then((resp) => {
        // Ensure login was successful by checking for valid response
        expect(resp.status).to.eq(200);
    });
});

Cypress.Commands.add('logout', () => {
    cy.request({
        method: 'POST',
        url: 'http://localhost:8000/api/method/logout', // Adjust URL to your Frappe site
    }).then((resp) => {
        // Ensure logout was successful by checking for valid response
        expect(resp.status).to.eq(200);
    });
});