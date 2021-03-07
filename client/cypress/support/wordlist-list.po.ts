export class WordlistListPage {
  navigateTo() {
    return cy.visit('/wordlists');
  }

  getWordlistCards() {
    return cy.get('.wordlist-cards-container app-wordlist-card');
  }

  getWordlistListItems() {
    return cy.get('.wordlist-nav-list .wordlist-list-item');
  }

  /**
   * Clicks the "view info" button for the given wordlist card.
   * Requires being in the "card" view.
   *
   * @param card The wordlist card
   */
  clickViewInfo(card: Cypress.Chainable<JQuery<HTMLElement>>) {
    return card.find<HTMLButtonElement>('[data-test=viewInfoButton]').click();
  }

  /**
   * Change the view of wordlists.
   *
   * @param viewType Which view type to change to: "card" or "list".
   */
  changeView(viewType: 'card' | 'list') {
    return cy.get(`[data-test=viewTypeRadio] .mat-radio-button[value="${viewType}"]`).click();
  }

}
