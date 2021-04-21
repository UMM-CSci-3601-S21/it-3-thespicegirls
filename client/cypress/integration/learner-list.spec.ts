import { AddPackPage } from 'cypress/support/add-contextpack.po';
import { LearnerListPage } from 'cypress/support/learner-list.po';

const page = new LearnerListPage();
const pageLogin = new AddPackPage();

describe('Learner List View', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should type something in the name filter and check that it returned correct elements', () => {
    cy.get('[data-test=learnerNameInput]').clear();
    cy.get('[data-test=learnerNameInput]').type('Jimmy');

    page.getLearnerCards().each(e => {
      cy.wrap(e).find('.simpleView').should('contain.text', 'Jimmy');
    });
  });

  it('Should type something partial in the name filter and check that it returned correct elements', () => {
    cy.get('[data-test=learnerNameInput]').type('d').wait(1000);

    page.getLearnerCards().should('have.lengthOf.above', 0);

    page.getLearnerCards().find('.simpleView').should('contain.text', 'Daisy').should('not.contain.text', ' Jimmy\n');
  });

  it('Should click view info on a learner and go to the right URL', () => {
    page.getLearnerCards().first().then((card) => {
      const firstLearner = card.find('.simpleView').text();

      page.clickViewInfo(page.getLearnerCards().first());
      cy.url().should('match', /\/learner\/[0-9a-fA-F]{24}$/);
    });
  });

});

