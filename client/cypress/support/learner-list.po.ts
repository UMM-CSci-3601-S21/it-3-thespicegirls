export class LearnerListPage {
  navigateTo() {
    return cy.visit('/learner');
  }

  getLearnerCards() {
    return cy.get('.learner-card');
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






  enableEditDeleteMode(){
    return cy.get('.editView').click({force: true});
  }

  enableAddMode(){
    return cy.get('.addView').click({force: true});
  }

}
