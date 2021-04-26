import { AddPackPage } from 'cypress/support/add-contextpack.po';
import { LearnerListPage } from 'cypress/support/learner-list.po';

const page = new LearnerListPage();
const pageLogin = new AddPackPage();

describe('Learner list view',()=>{

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should say you need to be an admin if not admin', () => {
    cy.get('.admin').should('contain.text', 'Must be an admin to have learners.');
  });

  it('Should say you need to be an admin if logged in and not an admin', () => {
    pageLogin.googleLogin();
    window.localStorage.setItem('userId', '606a5a9fd2b1da77da015c95');
    window.localStorage.setItem('loggedIn', 'true');
    cy.get('.admin').should('contain.text', 'Must be an admin to have learners.');
  });

  it('Should type something in the name filter and check that it returned correct elements', () => {
    pageLogin.googleAdminLogin();
    window.localStorage.setItem('admin', 'true');
    window.localStorage.setItem('userId', '606a5a9fd2b1da77da015c95');
    window.localStorage.setItem('loggedIn', 'true');
    cy.reload();
    cy.get('[data-test=learnerNameInput]').clear();
    cy.get('[data-test=learnerNameInput]').type('jimmy');

    // All of the contextpack cards should have the topic we are filtering by plus
    //appropriate mat-icon
    page.getLearnerCards().each(e => {
      cy.wrap(e).find('.learner-name').should('contain.text', 'Jimmy');
    });
  });

  it('Should type something partial in the name filter and check that it returned correct elements', () => {
    pageLogin.googleAdminLogin();
    window.localStorage.setItem('admin', 'true');
    window.localStorage.setItem('userId', '606a5a9fd2b1da77da015c95');
    window.localStorage.setItem('loggedIn', 'true');
    cy.reload();
    cy.get('[data-test=learnerNameInput]').type('j').wait(1000);

    page.getLearnerCards().should('have.lengthOf.above', 0);

    // Go through each of the cards that are being shown and get the topics
    page.getLearnerCards().find('.learner-name')
      // We should see these topics
      .should('contain.text', 'Jimmy')
      // We shouldn't see these topics
      .should('not.contain.text', 'Mildred')
      .should('not.contain.text', 'Grace');
  });

  it('Should click view info on a contextpack and go to the right URL', () => {
    pageLogin.googleAdminLogin();
    window.localStorage.setItem('admin', 'true');
    window.localStorage.setItem('userId', '606a5a9fd2b1da77da015c95');
    window.localStorage.setItem('loggedIn', 'true');
    cy.reload();
    page.getLearnerCards().first().then((card) => {
      const firstLearnerName = card.find('.learner-name').text();

      // When the view info button on the first contextpack card is clicked, the URL should have a valid mongo ID
      page.clickViewInfo(page.getLearnerCards().first());

      // The URL should be '/contextpacks/' followed by a mongo ID
      cy.url().should('match', /\/learner\/[0-9a-fA-F]{24}$/);

      // On this info page we were sent to, the topic and topic should be correct
      cy.get('.learner-name').first().should('have.text', firstLearnerName);

  });
});

  it('Should correctly list enabled wordlists', () => {
    pageLogin.googleAdminLogin();
    window.localStorage.setItem('admin', 'true');
    window.localStorage.setItem('userId', '606a5a9fd2b1da77da015c95');
    window.localStorage.setItem('loggedIn', 'true');
    cy.reload();
    page.clickViewInfo(page.getLearnerCards().first());

    const disabledWordlists = page.getDisabledWordlists();
    const enabledWordlists = page.getEnabledWordlists();

    page.getEnabledWordlists().each(e => {
      cy.wrap(e).should('not.contain.text', disabledWordlists);
    });
    page.getDisabledWordlists().each(e => {
      cy.wrap(e).should('not.contain.text', enabledWordlists);
    });
  });

  it('Should check that a user cannot add a new learner unless they are logged in', () => {
    cy.get('.add').should('not.exist');

    cy.reload();
    pageLogin.googleAdminLogin();
    window.localStorage.setItem('admin', 'true');
    window.localStorage.setItem('userId', '606a5a9fd2b1da77da015c95');
    window.localStorage.setItem('loggedIn', 'true');

    cy.get('.add').should('exist');
  });
  it('Should see return to context packs button if log out on info page', () => {
    pageLogin.googleAdminLogin();
    window.localStorage.setItem('admin', 'true');
    window.localStorage.setItem('userId', '606a5a9fd2b1da77da015c95');
    window.localStorage.setItem('loggedIn', 'true');
    cy.reload();
    //page should start with assigned words
    page.getLearnerCards().first().wait(1000).then((card) => {
      page.clickViewInfo(page.getLearnerCards().first()).wait(1000);
      window.localStorage.setItem('admin', 'false');
      cy.get('#googleSignOutBtn').click();
      cy.get('.home').should('contain.text', 'Return to context packs');
    });
  });

   it('Should login and add a new learner', () => {
    pageLogin.googleAdminLogin();
    window.localStorage.setItem('admin', 'true');
    window.localStorage.setItem('userId', '606a5a9fd2b1da77da015c95');
    window.localStorage.setItem('loggedIn', 'true');
    cy.reload();

    page.addLearner('Chris');

    cy.get('.mat-simple-snackbar').should('contain.text','Added Chris');
  });

  it('Should login and fail to add a new learner', () => {
    pageLogin.googleAdminLogin();
    window.localStorage.setItem('admin', 'true');
    window.localStorage.setItem('userId', '606a5a9fd2b1da77da015c95');
    window.localStorage.setItem('loggedIn', 'true');
    cy.reload();

    cy.get<HTMLButtonElement>('[data-test=addLearnerButton]').click();

    it('should have an error message for an empty name', () => {
      expect(page.addLearner('')).should('contain.text','Unable to add a Learner without a valid name');
    });
  });

  it('Should list assigned words', () => {
    pageLogin.googleAdminLogin();
    window.localStorage.setItem('admin', 'true');
    window.localStorage.setItem('userId', '606a5a9fd2b1da77da015c95');
    window.localStorage.setItem('loggedIn', 'true');
    cy.reload();
    //page should start with assigned words
    page.clickViewInfo(page.getLearnerCards().first());
    const assignedWords = page.getAssignedWords();
    // There should be words present for nouns, verbs, adjectives
    // (not all lists have misc)
    expect(assignedWords).to.have.length(3);
    const dropdown = page.assignWordlist();
    cy.get('.toggle-list-assign input').eq(0).should('be.checked');
    cy.get('.toggle-list-assign input').eq(0).click({force:true});
    cy.get('.toggle-list-assign input').eq(0).should('not.be.checked');
  });

  it('Should correctly assign a wordlist', () => {
    pageLogin.googleAdminLogin();
    window.localStorage.setItem('admin', 'true');
    window.localStorage.setItem('userId', '606a5a9fd2b1da77da015c95');
    window.localStorage.setItem('loggedIn', 'true');
    cy.reload();
    //page should start with assigned words
    page.getLearnerCards().first().then((card) => {
      page.clickViewInfo(page.getLearnerCards().first()).wait(1000);
      page.assignWordlist();
      // checking the box should add the wordlist to enabled list
      // and remove from disabled
      cy.get('.toggle-list-assign input').eq(1).should('be.checked').wait(1000);
      cy.get('.toggle-list-assign input').eq(2).should('be.checked').wait(1000);
      cy.get('.toggle-list-assign input').eq(0).should('not.be.checked');
      cy.get('.toggle-list-assign input').eq(1).click({force:true});
      cy.get('.toggle-list-assign input').eq(1).should('not.be.checked');

    });
  });

  it('Should view a learner info page, and use the back button', () => {
    pageLogin.googleAdminLogin();
    window.localStorage.setItem('admin', 'true');
    window.localStorage.setItem('userId', '606a5a9fd2b1da77da015c95');
    window.localStorage.setItem('loggedIn', 'true');
    cy.reload();
    page.getLearnerCards().first().then((card) => {
      page.clickViewInfo(page.getLearnerCards().first());
      cy.get('.back-button').should('be.visible');
      cy.get('.back-button').click();
    });
    cy.get('.learner-list-title').should('contain.text','My Learners');
  });
  it('Should have the correct title', () => {
    cy.get('.learner-list-title').should('have.text','My Learners');
  });

});
