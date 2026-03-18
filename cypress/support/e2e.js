// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// You can add more global Cypress commands or configurations here
beforeEach(() => {
  // Clear localStorage before each test
  cy.clearLocalStorage()
})
