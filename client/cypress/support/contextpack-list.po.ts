export class ContextpackListPage {
  navigateTo() {
    return cy.visit('/contextpacks');
  }

  getContextpackCards() {
    return cy.get('.contextpack-card');
  }

  /**
   * Clicks the "view info" button for the given contextpack card.
   * Requires being in the "card" view.
   *
   * @param card The contextpack card
   */
  clickViewInfo(card: Cypress.Chainable<JQuery<HTMLElement>>) {
    return card.find<HTMLButtonElement>('[data-test=viewInfoButton]').click();
  }

  selectView(value: string) {
    // Find and click the drop down
    return cy.get('[data-test=contextpackWordSelect]').click()
      // Select and click the desired value from the resulting menu
      .get(`mat-option[value="${value}"]`).click();
  }

  nounDest(value: string) {
    // Find and click the drop down
    return cy.get('[data-test=nounDest]').click()
      // Select and click the desired value from the resulting menu
      .get(`mat-option[value="${value}"]`).click();
  }

  enableEditDeleteMode(){
    return cy.get('.editView').click({force: true});
  }

  enableAddMode(){
    return cy.get('.addView').click({force: true});
  }

}
