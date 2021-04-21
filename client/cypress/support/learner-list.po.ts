import {Learner} from 'src/app/learners/learner';
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

  getFormField(fieldName: string) {
    return cy.get(`mat-form-field [formcontrolname=${fieldName}]`);
  }

  addLearner(name: string){
    this.getFormField('name').type(name);
    cy.get<HTMLButtonElement>('[data-test=addLearnerButton]').click();
  }

}
