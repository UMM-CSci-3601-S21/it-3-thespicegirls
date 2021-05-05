import { AppPage } from '../support/app.po';

const page = new AppPage();

describe('App', () => {
  beforeEach(() => page.navigateTo());

  it('Should have the correct title', () => {
    page.getAppTitle().should('contain', 'Word River');
  });

  describe('Sidenav', () => {
    it('Should be invisible by default', () => {
      // Before clicking on the button, the sidenav should be hidden
      page.getSidenav()
        .should('be.hidden')
        .and('not.be.visible');
    });

    it('Should be openable by clicking the sidenav button', () => {
      page.getSidenavButton().click();

      page.getSidenav()
        .should('not.be.hidden')
        .and('be.visible');
    });

    it('Should have a working navigation to "Contextpacks"', () => {
      page.getSidenavButton().click();
      page.getSidenav();
      page.getNavLink('Context Packs').click();
      cy.url().should('match', /.*\/contextpacks$/);
    });

    it('Should have a working navigation to "Learners"', () => {
      page.getSidenavButton().click();
      page.getSidenav();
      page.getNavLink('Learners').click();
      cy.url().should('match', /.*\/learner$/);
    });
  });

});
