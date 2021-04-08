import { ContextPack } from 'src/app/contextpacks/contextpack';
import { AddPackPage } from '../support/add-contextpack.po';

describe('Add a Context pack', () => {
  const page = new AddPackPage();

  beforeEach(() => {
    page.navigateTo();
  });

  it('should see need to login page if local storage isnt set up', () =>{
    cy.get('.sign').eq(0).should('contain.text','Sign in to add context pack');

  });
  it('Should have the correct title', () => {
    window.localStorage.setItem('loggedIn', 'true');
    cy.reload();
    page.getTitle().should('have.text', 'Create A New Context Pack');
  });

  it('Should add parts of speech when buttons are pushed and show a json file preview with button push', () => {
    window.localStorage.setItem('loggedIn', 'true');
    cy.reload();
    page.addWordlist();
    page.getJsonTab();
    page.contextPackForm().should('contain', 'nouns');
    page.addPosArray(`noun`);
    page.contextPackForm().should('contain', 'nouns');
  });
  it('should disable submission when needed', () =>{
    window.localStorage.setItem('loggedIn', 'true');
    cy.reload();
    page.addWordlist();
    page.addPosArray('noun');

    page.getFormField('name').then(els => {
      [...els].forEach(el => cy.wrap(el).type('Hello World', {force:true}));
    });
    page.addPackButton().should('be.enabled');
  });
  it('Should show error messages for invalid inputs', () => {
    window.localStorage.setItem('loggedIn', 'true');
    cy.reload();
    // Before doing anything there shouldn't be an error
    cy.get('[data-test=nameError]').should('not.exist');
    // Just clicking the name field without entering anything should cause an error message

    page.getFormField('name').click().blur();
    cy.get('[data-test=nameError]').should('exist').and('be.visible');
    // Entering a valid name should remove the error.
    page.getFormField('name').clear().type('Jojo').blur();
    cy.get('[data-test=nameError]').should('not.exist');

    //Check wordlists as well
    page.addWordlist();
    page.addPosArray('noun');
    cy.get('[data-test=nameError]').should('not.exist');
    page.getFormField('name').then(els => {
      [...els].forEach(el => cy.wrap(el).click().blur());
    });
    page.getFormField('name').then(els => {
      [...els].forEach(el => cy.wrap(el).type('horsies'));
    });
    cy.get('[data-test=nameError]').should('not.exist');

  });

  it('should add a new pack', () =>{
    window.localStorage.setItem('loggedIn', 'true');
    cy.reload();
    page.googleLogin();
    const pack: ContextPack = {
      _id: null,
      name: 'barn',
      enabled: true,
      wordlists: [

      {
        name: 'farm_animals',
        enabled: true,
        nouns: [
          {word: 'goat', forms: ['goat', 'goats']},
        ],

        verbs: [
          {word: 'moo', forms: ['moo','moos','mooed','mooing']},
        ],

        adjectives:
        [

        ],

        misc:
        [

        ]
      },
      {
        name:  'farm_equipment',
        enabled: true,
        nouns:
        [
          {word: 'harrow', forms: ['harrow', 'harrows']},
        ],

        verbs: [
          {word: 'farm', forms: [
            'farm',
            'farms',
            'farmed',
            'farming'
          ]},
        ],

        adjectives:
        [

        ],
        misc: [

        ]
      }
    ]
    };
    page.addPack(pack);

    cy.url()
        .should('match', /\/contextpacks\/[0-9a-fA-F]{24}$/)
        .should('not.match', /\/edit/);

    cy.get('.mat-simple-snackbar').should('contain', `Added Pack ${pack.name}`);

  });

  it('should fail to add a new pack if not logged in', () =>{
    window.localStorage.setItem('loggedIn', 'true');
    cy.reload();
    const pack: ContextPack = {
      _id: null,
      name: 'barn',
      enabled: true,
      wordlists: [

      {
        name: 'farm_animals',
        enabled: true,
        nouns: [
          {word: 'goat', forms: ['goat', 'goats']},
        ],

        verbs: [
          {word: 'moo', forms: ['moo','moos','mooed','mooing']},
        ],

        adjectives:
        [

        ],

        misc:
        [

        ]
      },
      {
        name:  'farm_equipment',
        enabled: true,
        nouns:
        [
          {word: 'harrow', forms: ['harrow', 'harrows']},
        ],

        verbs: [
          {word: 'farm', forms: [
            'farm',
            'farms',
            'farmed',
            'farming'
          ]},
        ],

        adjectives:
        [

        ],
        misc: [

        ]
      }
    ]
    };
    page.addPack(pack);

    cy.url()
        .should('match', /\/edit/)
        .should('not.match', /\/contextpacks\/[0-9a-fA-F]{24}$/);

    cy.get('.mat-simple-snackbar').should('contain', `Failed`);

  });

  });
