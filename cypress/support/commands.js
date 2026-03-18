// Custom Cypress commands can be added here
// Example:
// Cypress.Commands.add('login', (email, password) => { ... })

// Custom command to wait for timer to update
Cypress.Commands.add('waitForTimerUpdate', (initialTime) => {
  cy.get('#timer').should('not.contain', initialTime)
})
