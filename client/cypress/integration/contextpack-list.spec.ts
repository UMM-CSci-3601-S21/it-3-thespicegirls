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
    cy.get('[data-test=contextpackNameInput]').type('j').wait(1000);

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
    page.clickViewInfo(page.getContextpackCards().first()).wait(1000);
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
    page.clickViewInfo(page.getContextpackCards().first()).wait(4000);

    page.enableEditDeleteMode();
    cy.get('.wordlist-removeNoun').should('be.visible');

    cy.get('.wordlist-nounChip').eq(0).should('contain.text','goat');
    cy.get('.wordlist-removeNoun').eq(0).click();
    cy.get('.mat-simple-snackbar').should('contain', 'Deleted goat from Word list: farm_animals');
    cy.get('.wordlist-nounChip').eq(0).should('not.contain.text','goat');
  });
  it('Should click the edit button and delete a wordlist if they are an admin', () => {
    // login as admin
    pageLogin.googleAdminLogin();
    window.localStorage.setItem('admin', 'true');
    cy.reload();
    page.clickViewInfo(page.getContextpackCards().first());
    page.enableEditDeleteMode();
    // farm animals list should be present before deleting
    cy.get('.wordlist-name').should('contain.text', 'farm_animals');
    cy.get('.delete-wordlist-button').eq(0).should('be.visible');
    cy.get('.delete-wordlist-button').eq(0).should('contain.text','delete');
    page.clickDeleteWordlist(page.getContextpackCards().first());
    // Farm animals list should be gone now
    cy.get('.confirmation').should('contain.text', 'Are you sure you want to delete this wordlist?');
    page.clickConfirmDeleteWordlist(page.getContextpackCards().first());
    cy.get('.wordlist-name').should('not.contain.text', 'farm_animals');
  });

  it('Should click the edit button and delete a word if they are the creator', () => {
    pageLogin.googleLogin();
    window.localStorage.setItem('admin', 'false');
    window.localStorage.setItem('userId', '606a5a9fd2b1da77da015c95');
    cy.reload();
    page.clickViewInfo(page.getContextpackCards().eq(2));

    page.enableEditDeleteMode();
    cy.get('.wordlist-removeNoun').should('be.visible').wait(1000);

    cy.get('.wordlist-nounChip').eq(0).should('contain.text','cake');
    cy.get('.wordlist-removeNoun').eq(0).click();
    cy.get('.mat-simple-snackbar').should('contain', 'Deleted cake from Word list: birthday');
    cy.get('.wordlist-nounChip').eq(0).should('not.contain.text','cake');
  });
  it('Should click the edit button and delete a wordlist if they are an creator', () => {
    // login as admin
    pageLogin.googleLogin();
    window.localStorage.setItem('admin', 'false');
    window.localStorage.setItem('userId', '606a5a9fd2b1da77da015c95');
    cy.reload();
    page.clickViewInfo(page.getContextpackCards().eq(2));
    page.enableEditDeleteMode();
    // farm animals list should be present before deleting
    cy.get('.wordlist-name').should('contain.text', 'birthday');
    cy.get('.delete-wordlist-button').eq(0).should('be.visible');
    cy.get('.delete-wordlist-button').eq(0).should('contain.text','delete');
    page.clickDeleteWordlist(page.getContextpackCards().first());
    // Farm animals list should be gone now
    cy.get('.confirmation').should('contain.text', 'Are you sure you want to delete this wordlist?');
    page.clickConfirmDeleteWordlist(page.getContextpackCards().first());
    cy.get('.wordlist-name').should('not.exist');
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
    cy.get('.wordlist-disable-button').eq(0).click().wait(1000);
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
    cy.reload().wait(5000);
    page.clickViewInfo(page.getContextpackCards().eq(2)).wait(5000);

    page.enableAddMode();
    cy.get('.addNouns').click();
    cy.get('.nounWord').type('test2');
    cy.get('[data-test=nounDest]').click().get(`mat-option`).eq(0).click();
    cy.get('.addNounButton').eq(0).click();
    cy.get('.mat-simple-snackbar').should('contain','Added test2, to Word list: birthday').wait(1000);

    cy.get('.wordlist-nounChip').should('contain.text', 'test2');
  });
  it('Should click the add button and then add a noun if you are creator', () => {
    pageLogin.googleLogin();
    window.localStorage.setItem('admin', 'false');
    window.localStorage.setItem('userId', '606a5a9fd2b1da77da015c95');
    cy.reload();
    page.clickViewInfo(page.getContextpackCards().eq(2)).wait(1000);

    page.enableAddMode();
    cy.get('.addNouns').click();
    cy.get('.nounWord').type('test');
    cy.get('[data-test=nounDest]').click().get(`mat-option`).eq(0).click();
    cy.get('.addNounButton').eq(0).click();
    cy.get('.mat-simple-snackbar').should('contain','Added test, to Word list: birthday').wait(1000);

    cy.get('.wordlist-nounChip').should('contain.text', 'test');
  });
  it('should click on the add button and add a wordlist if admin',()=>{
    window.localStorage.setItem('admin', 'true');
    cy.reload();
    pageLogin.googleAdminLogin();
    cy.reload();
    page.clickViewInfo(page.getContextpackCards().first()).wait(1000);

    page.enableAddMode();
    cy.get('.addWordlist').click();
    cy.get('.addWordlistInput').type('test');
    cy.get('.addWordlistButton').click();

  });
  it('should click on the add button and add a wordlist if creator',()=>{
    pageLogin.googleLogin();
    window.localStorage.setItem('admin', 'false');
    window.localStorage.setItem('userId', '606a5a9fd2b1da77da015c95');
    cy.reload();
    page.clickViewInfo(page.getContextpackCards().eq(2)).wait(1000);

    page.enableAddMode();
    cy.get('.addWordlist').click();
    cy.get('.addWordlistInput').type('test');
    cy.get('.addWordlistButton').click();

  });

});

