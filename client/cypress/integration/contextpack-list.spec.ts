import { ContextpackListPage } from '../support/contextpack-list.po';

const page = new ContextpackListPage();

describe('Contextpack list', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should type something in the name filter and check that it returned correct elements', () => {
    // Filter for contextpack 'batman_villains'
    cy.get('[data-test=contextpackNameInput]').clear();
    cy.get('[data-test=contextpackNameInput]').type('farm');

    // All of the contextpack cards should have the topic we are filtering by
    page.getContextpackCards().each(e => {
      cy.wrap(e).find('.contextpack-card-name').should('contain.text', 'farm');
    });
  });

  it('Should type something partial in the name filter and check that it returned correct elements', () => {
    // Filter for topics that contain 'd'
    cy.get('[data-test=contextpackNameInput]').type('j');

    page.getContextpackCards().should('have.lengthOf.above', 0);

    // Go through each of the cards that are being shown and get the topics
    page.getContextpackCards().find('.contextpack-card-name')
      // We should see these topics
      .should('contain.text', 'Jojo Siwa')
      // We shouldn't see these topics
      .should('not.contain.text', 'farm')
      .should('not.contain.text', 'batman_villains');
  });

  it('Should find a download button on contextpack info page', () => {
    page.clickViewInfo(page.getContextpackCards().first());

    cy.get('.contextpack-download-button').should('have.text', 'download');
  });

  it('Should click view info and see all the nouns and verbs', () => {
    page.clickViewInfo(page.getContextpackCards().first());

    cy.get('.contextpack-card-name').should('contain.text', 'farm');
    cy.get('.contextpack-card-enabled').should('contain.text', 'true');
    // cy.get('.contextpack-card-wordlists').should('contain.text', 'goat, goats, sheep, cat, cats, dog, '
    // + 'dogs, cow, cows, pig, pigs, chicken, chickens, duck, ducks, llama, llamas');
    // cy.get('.contextpack-card-wordlists').should('contain.text', 'moo, moos, mooed, mooing, oink, oinks, '
    // + 'oinked, oinking, cluck, clucks, clucking, clucked, baa, baas, baaed, baaing, meow, meows, meowing, '
    // + 'meowed, bark, barks, barked, barking');
  });

  it('Should click view info, select a view words, and see all the words', () => {
    page.clickViewInfo(page.getContextpackCards().first());
    page.selectView('false');

    cy.get('.contextpack-card-name').should('contain.text', 'farm');
    cy.get('.contextpack-card-enabled').should('contain.text', 'true');
    // cy.get('.contextpack-card-nouns').should('contain.text', 'goat, goats, sheep, cat, cats, dog, '
    // + 'dogs, cow, cows, pig, pigs, chicken, chickens, duck, ducks, llama, llamas');
    // cy.get('.contextpack-card-verbs').should('contain.text', 'moo, moos, mooed, mooing, oink, oinks, '
    // + 'oinked, oinking, cluck, clucks, clucking, clucked, baa, baas, baaed, baaing, meow, meows, meowing, '
    // + 'meowed, bark, barks, barked, barking');
  });


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
