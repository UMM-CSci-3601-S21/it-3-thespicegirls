import { WordlistListPage } from '../support/wordlist-list.po';

const page = new WordlistListPage();

describe('Wordlist list', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should show 4 wordlists in both card and list view', () => {
    page.getWordlistCards().should('have.length', 4);
    page.changeView('list');
    page.getWordlistListItems().should('have.length', 4);
  });

  it('Should type something in the topic filter and check that it returned correct elements', () => {
    // Filter for wordlist 'batman_villains'
    cy.get('[data-test=wordlistTopicInput]').type('batman_villains');

    // All of the wordlist cards should have the topic we are filtering by
    page.getWordlistCards().each(e => {
      cy.wrap(e).find('.wordlist-card-topic').should('have.text', 'batman_villains');
    });

    // (We check this two ways to show multiple ways to check this)
    page.getWordlistCards().find('.wordlist-card-topic').each(el =>
      expect(el.text()).to.equal('batman_villains')
    );
  });

  it('Should type something partial in the topic filter and check that it returned correct elements', () => {
    // Filter for topics that contain 'd'
    cy.get('[data-test=wordlistTopicInput]').type('d');

    page.getWordlistCards().should('have.lengthOf.above', 0);

    // Go through each of the cards that are being shown and get the topics
    page.getWordlistCards().find('.wordlist-card-topic')
      // We should see these topics
      .should('contain.text', 'default')
      .should('contain.text', 'birthday')
      // We shouldn't see these topics
      .should('not.contain.text', 'jojo')
      .should('not.contain.text', 'batman_villains');
  });

  it('Should change the view', () => {
    // Choose the view type "List"
    page.changeView('list');

    // We should not see any cards
    // There should be list items
    page.getWordlistCards().should('not.exist');
    page.getWordlistListItems().should('exist');

    // Choose the view type "Card"
    page.changeView('card');

    // There should be cards
    // We should not see any list items
    page.getWordlistCards().should('exist');
    page.getWordlistListItems().should('not.exist');
  });

  it('Should type a topic, switch the view, and check that it returned correct elements', () => {
    // Filter for wordlist 'batman_villains'
    cy.get('[data-test=wordlistTopicInput]').type('batman_villains');


    // Choose the view type "List"
    page.changeView('list');

    // Some of the wordlists should be listed
    page.getWordlistListItems().should('have.lengthOf.above', 0);

    // (We check this two ways to show multiple ways to check this)
    page.getWordlistListItems().each(el => {
      cy.wrap(el).find('.wordlist-list-topic').should('contain', 'batman');
    });
  });

  it('Should click view profile on a wordlist and go to the right URL', () => {
    page.getWordlistCards().first().then((card) => {
      const firstWordlistTopic = card.find('.wordlist-card-topic').text();
      const firstWordlistEnabled = card.find('.wordlist-card-enabled').text();

      // When the view profile button on the first wordlist card is clicked, the URL should have a valid mongo ID
      page.clickViewInfo(page.getWordlistCards().first());

      // The URL should be '/wordlists/' followed by a mongo ID
      cy.url().should('match', /\/wordlists\/[0-9a-fA-F]{24}$/);

      // On this profile page we were sent to, the topic and topic should be correct
      cy.get('.wordlist-card-topic').first().should('have.text', firstWordlistTopic);
      cy.get('.wordlist-card-enabled').first().should('have.text', firstWordlistEnabled);
      cy.get('.wordlist-card-nouns').first().should('contain.text', 'cake');
    });
   });
});
