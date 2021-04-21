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

  it('Should check that a user cannot add a new learner unless they are logged in', () => {
    cy.get('.add').should('not.exist');

    window.localStorage.setItem('loggedIn', 'true');
    cy.reload();
    pageLogin.googleLogin();

    cy.get('.add').should('exist');
  });

  it('Should login and add a new learner', () => {
    window.localStorage.setItem('loggedIn', 'true');
    window.localStorage.setItem('User','TestUser');
    cy.reload();
    pageLogin.googleLogin();

    page.addLearner('Chris');

    cy.get('.mat-simple-snackbar').should('contain.text','Added Chris');
  });

  it('Should login and fail to add a new learner', () => {
    window.localStorage.setItem('loggedIn', 'true');
    cy.reload();
    pageLogin.googleLogin();

    cy.get<HTMLButtonElement>('[data-test=addLearnerButton]').click();

    cy.get('.mat-simple-snackbar').should('contain.text','Failed to add a new Learner');
  });

});

