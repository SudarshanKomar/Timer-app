describe('Timer App Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should load the timer app successfully', () => {
    cy.get('h1').should('contain', 'Time Flow')
    cy.get('#timer').should('contain', '25:00')
    cy.get('#session-type').should('contain', 'Work')
    cy.get('#session-count').should('contain', 'Session 1 of 4')
  })

  it('should have all control buttons', () => {
    cy.get('#start-btn').should('be.visible').and('not.be.disabled')
    cy.get('#pause-btn').should('be.visible').and('be.disabled')
    cy.get('#reset-btn').should('be.visible').and('not.be.disabled')
  })

  it('should have settings section with all inputs', () => {
    cy.get('#work-duration').should('have.value', '25')
    cy.get('#short-break').should('have.value', '5')
    cy.get('#long-break').should('have.value', '15')
    cy.get('#sessions-until-long').should('have.value', '4')
    cy.get('#apply-settings').should('be.visible')
  })

  it('should start the timer when start button is clicked', () => {
    cy.get('#start-btn').click()
    cy.get('#start-btn').should('be.disabled')
    cy.get('#pause-btn').should('not.be.disabled')
    // Timer should start counting down
    cy.get('#timer').should('not.contain', '25:00')
  })

  it('should pause the timer when pause button is clicked', () => {
    cy.get('#start-btn').click()
    cy.wait(1000) // Let timer run for a bit
    cy.get('#pause-btn').click()
    cy.get('#pause-btn').should('be.disabled')
    cy.get('#start-btn').should('not.be.disabled')
  })

  it('should reset the timer when reset button is clicked', () => {
    cy.get('#start-btn').click()
    cy.wait(1000) // Let timer run for a bit
    cy.get('#reset-btn').click()
    cy.get('#timer').should('contain', '25:00')
    cy.get('#start-btn').should('not.be.disabled')
    cy.get('#pause-btn').should('be.disabled')
  })

  it('should update settings when apply settings is clicked', () => {
    cy.get('#work-duration').clear().type('30')
    cy.get('#short-break').clear().type('10')
    cy.get('#long-break').clear().type('20')
    cy.get('#apply-settings').click()
    
    // Verify timer displays new work duration
    cy.get('#timer').should('contain', '30:00')
  })

  it('should show date and time in header', () => {
    cy.get('#datetime').should('be.visible')
    cy.get('#datetime').should('not.be.empty')
  })
})
