import { eq } from 'cypress/types/lodash';
import { ContextpackListPage } from '../support/contextpack-list.po';
import { AddPackPage } from '../support/add-contextpack.po';

const page = new ContextpackListPage();
const pageLogin = new AddPackPage();

describe('Contextpack List View', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should type something in the name filter and check that it returned correct elements', () => {
    cy.get('[data-test=contextpackNameInput]').clear();
    cy.get('[data-test=contextpackNameInput]').type('farm');

    // All of the contextpack cards should have the topic we are filtering by
    page.getContextpackCards().each(e => {
      cy.wrap(e).find('.contextpack-card-name').should('contain.text', 'farm');
    });
  });

  it('Should type something partial in the name filter and check that it returned correct elements', () => {
    cy.get('[data-test=contextpackNameInput]').type('j');

    page.getContextpackCards().should('have.lengthOf.above', 0);

    // Go through each of the cards that are being shown and get the topics
    page.getContextpackCards().find('.contextpack-card-name')
      // We should see these topics
      .should('contain.text', 'Jojo Siwa')
      // We shouldn't see these topics
      .should('not.contain.text', ' Farm\n')
      .should('not.contain.text', 'batman_villains');
  });

  it('Should click Contextpack name Farm and change it to Test', () => {});

  it('Should click view info on a contextpack and go to the right URL', () => {
    page.getContextpackCards().first().then((card) => {
      const firstContextpackTopic = card.find('.contextpack-card-name').text();
      const firstContextpackEnabled = card.find('.contextpack-card-enabled').text();


      // When the view info button on the first contextpack card is clicked, the URL should have a valid mongo ID
      page.clickViewInfo(page.getContextpackCards().first());

      // The URL should be '/contextpacks/' followed by a mongo ID
      cy.url().should('match', /\/contextpacks\/[0-9a-fA-F]{24}$/);

      // On this info page we were sent to, the topic and topic should be correct
      cy.get('.contextpack-card-name').first().should('have.text', firstContextpackTopic);
      cy.get('.contextpack-card-enabled').first().should('have.text', firstContextpackEnabled);
    });
  });
});

describe('Contextpack Info View', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should find a download button on contextpack info page', () => {
    page.clickViewInfo(page.getContextpackCards().first());

    cy.get('.contextpack-download-button').should('have.text', 'download');
  });

  it('Should click view info and see all the nouns and verbs', () => {
    page.clickViewInfo(page.getContextpackCards().first());

    cy.get('.contextpack-card-name').should('contain.text', 'farm');
    cy.get('.contextpack-card-enabled').should('contain.text', 'Enabled');
    cy.get('.wordlist-nounChip').should('contain.text', ' goat  sheep  cat  dog  cow  pig  chicken '
      + ' duck  llama  harrow  tractor  manure spreader  seed drill  baler  mower  cultivator  plow  backhoe '
      + ' loader  sprayer  sickle  rake  wagon  trailer  farm truck  hoe  shovel ');
    cy.get('.wordlist-verbChip').should('contain.text', ' moo  oink  cluck  baa  meow  bark  farm  grow  plow ');
  });

  it('Should click view info, select a view words, and see all the words', () => {
    page.clickViewInfo(page.getContextpackCards().first());
    page.selectView('false');

    cy.get('.contextpack-card-name').should('contain.text', 'farm');
    cy.get('.contextpack-card-enabled').should('contain.text', 'Enabled');
    cy.get('.nounChip').should('contain.text', ' goat  sheep  cat  dog  cow  pig '
    + ' chicken  duck  llama  harrow  tractor  manure spreader  seed drill  baler  mower '
    + ' cultivator  plow  backhoe  loader  sprayer  sickle  rake  wagon  trailer  farm truck  hoe  shovel ');
    cy.get('.verbChip').should('contain.text', ' moo  oink  cluck  baa  meow  bark  farm  grow  plow ');
  });

  it('Should click the icon URL and change it', () => {
    pageLogin.googleAdminLogin();
    window.localStorage.setItem('admin', 'true');
    cy.reload();
    page.clickViewInfo(page.getContextpackCards().first());
    pageLogin.googleAdminLogin();

    cy.get('.contextpack-card-icon').should('have.text',' barn.jpg\n');

  });

});

describe('Info Page Edit View', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should click the edit button and delete a word if they are an admin', () => {
    pageLogin.googleAdminLogin();
    window.localStorage.setItem('admin', 'true');
    cy.reload();
    page.clickViewInfo(page.getContextpackCards().first());

    page.enableEditDeleteMode();
    cy.get('.wordlist-removeVerb').should('be.visible');

    cy.get('.wordlist-verbChip').eq(0).should('contain.text','moo');
    cy.get('.wordlist-removeVerb').eq(0).click();
    cy.get('.mat-simple-snackbar').should('contain', 'Deleted moo from Word list: farm_animals');
    cy.get('.wordlist-verbChip').eq(0).should('not.contain.text','moo');
  });

  it('Should not see an edit button if not an admin', () => {
    cy.get('.wordlist-disable-button').should('not.exist');
  });
  it('Should click the edit button and change the enabled status if logged into admin account', () => {
    pageLogin.googleAdminLogin();
    window.localStorage.setItem('admin', 'true');
    cy.reload();
    page.clickViewInfo(page.getContextpackCards().first());

    cy.get('.wordlist-enabled').eq(0).should('contain.text','Enabled');

    page.enableEditDeleteMode();
    cy.get('.wordlist-disable-button').should('be.visible');
    cy.get('.wordlist-disable-button').eq(0).click();
    cy.get('.mat-simple-snackbar').should('contain', 'Updated enabled status of Word list: farm_animals').wait(1000);
    page.enableEditDeleteMode();
    cy.get('.wordlist-enabled').eq(0).should('contain.text','Disabled ');
  });
});

describe('Info Page Add View', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should not see an add button if not logged in', () => {
    window.localStorage.setItem('admin', 'false');
    cy.reload();
    page.clickViewInfo(page.getContextpackCards().first());

    cy.get('.addNouns').should('not.exist');

  });

  it('Should click the add button and then add a noun', () => {
    window.localStorage.setItem('admin', 'true');
    cy.reload();
    pageLogin.googleAdminLogin();
    cy.reload();
    page.clickViewInfo(page.getContextpackCards().first());

    page.enableAddMode();
    cy.get('.addNouns').click();
    cy.get('.nounWord').type('test');
    cy.get('[data-test=nounDest]').click().get(`mat-option`).eq(0).click();
    cy.get('.addNounButton').eq(0).click();
    cy.get('.mat-simple-snackbar').should('contain','Added test, to Word list: farm_animals').wait(1000);

    cy.get('.wordlist-nounChip').should('contain.text', ' goat  sheep  cat  dog  cow  pig  chicken '
      + ' duck  llama  test  harrow  tractor  manure spreader  seed drill  baler  mower  cultivator  plow  backhoe '
      + ' loader  sprayer  sickle  rake  wagon  trailer  farm truck  hoe  shovel ');
  });

});

