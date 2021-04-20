export class LearnerListPage {
  navigateTo() {
    return cy.visit('/learner');
  }

  getLearnerCards() {
    return cy.get('.learner-card');
  }

  clickViewInfo(card: Cypress.Chainable<JQuery<HTMLElement>>) {
    return card.find<HTMLButtonElement>('[data-test=viewInfoButton]').click();
  }

  clickJSONDownload(card: Cypress.Chainable<JQuery<HTMLElement>>) {
    return card.find<HTMLButtonElement>('[data-test=downloadJSON]').click();
  }

}
