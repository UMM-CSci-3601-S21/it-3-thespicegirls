export class ContextpackListPage {
  navigateTo() {
    return cy.visit('/contextpacks');
  }

  getContextpackCards() {
    return cy.get('.contextpack-card');
  }

  getContextpackListItems() {
    return cy.get('.contextpack-nav-list .contextpack-list-item');
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

  /**
   * Change the view of contextpacks.
   *
   * @param viewType Which view type to change to: "card" or "list".
   */
  changeView(viewType: 'card' | 'list') {
    return cy.get(`[data-test=viewTypeRadio] .mat-radio-button[value="${viewType}"]`).click();
  }

}
