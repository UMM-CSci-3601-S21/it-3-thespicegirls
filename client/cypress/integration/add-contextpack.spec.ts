import { ContextPack } from 'src/app/contextpacks/contextpack';
import { User } from 'src/app/users/user';
import { AddPackPage } from '../support/add-contextpack.po';

describe('Add a Context pack', () => {
  const page = new AddPackPage();

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getTitle().should('have.text', 'Create A New Context Pack');
  });

  it('Should add parts of speech when buttons are pushed and show a json file preview with button push', () => {
    // ADD USER button should be disabled until all the necessary fields
    // are filled. Once the last (`#emailField`) is filled, then the button should
    // become enabled.
    page.addWordlist();
    page.showJson();
    page.contextPackForm().should('contain', 'nouns');
    page.addPosArray(`noun`);
    page.contextPackForm().should('contain', 'nouns');
  });
  it('should disable submission when needed', () =>{
    page.addPackButton().should('be.disabled');
    page.addWordlist();
    page.addPosArray('noun');
    page.showJson();
    page.getFormField('word').type('test');
    page.addPackButton().should('be.disabled');
    page.getFormField('name').then(els => {
      [...els].forEach(el => cy.wrap(el).type('Hello World'));
    });
    page.addPackButton().should('be.disabled');
    page.selectMatSelectValue( page.getFormField('enabled'), 'true'  );
  });
  it('Should show error messages for invalid inputs', () => {
    // Before doing anything there shouldn't be an error
    cy.get('[data-test=nameError]').should('not.exist');
    // Just clicking the name field without entering anything should cause an error message
    page.showJson();
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
    page.showJson();

    const pack: ContextPack = {
      _id: null,
      name: 'farm',
      enabled: true,
      wordlists: [

      {
        name: 'farm_animals',
        enabled: true,
        nouns: [
          {word: 'goat', forms: ['goat', 'goats']},
          {word: 'sheep', forms: ['sheep']},
          {word: 'cat', forms: ['cat', 'cats']},
          {word: 'dog', forms: ['dog', 'dogs']},
          {word: 'cow', forms: ['cow', 'cows']},
          {word: 'pig', forms: ['pig', 'pigs']},
          {word: 'chicken', forms: ['chicken', 'chickens']},
          {word: 'duck', forms: ['duck', 'ducks']},
          {word: 'llama', forms: ['llama', 'llamas']}
        ],

        verbs: [
          {word: 'moo', forms: ['moo','moos','mooed','mooing']},
          {word: 'oink', forms: ['oink','oinks','oinked','oinking']},
          {word: 'cluck', forms: ['cluck','clucks','clucking','clucked']},
          {word: 'baa', forms: ['baa','baas', 'baaed','baaing']},
          {word: 'meow', forms: ['meow','meows','meowing','meowed']},
          {word: 'bark', forms: ['bark','barks','barked','barking']}
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
          {word: 'tractor', forms: ['tractor', 'tractors']},
          {word: 'manure spreader', forms: ['manure spreader', 'manure spreaders']},
          {word: 'seed drill', forms: ['seed drill', 'seed drills']},
          {word: 'baler', forms:  ['baler', 'balers']},
          {word: 'mower', forms: ['mower', 'mowers']},
          {word: 'cultivator', forms: ['cultivator', 'cultivators']},
          {word: 'plow', forms:  ['plow', 'plows']},
          {word: 'backhoe', forms:  ['backhoe', 'backhoes']},
          {word: 'loader', forms: ['loader', 'loaders']},
          {word: 'sprayer', forms: ['sprayer', 'sprayers']},
          {word: 'sickle', forms: ['sickle', 'sickles']},
          {word: 'rake', forms: ['rake', 'rakes']},
          {word: 'wagon', forms: ['wagon']},
          {word: 'trailer', forms:  ['trailer']},
          {word: 'farm truck', forms:  ['farm truck']},
          {word: 'hoe', forms:  ['hoe']},
          {word: 'shovel', forms: ['shovel']}
        ],

        verbs: [
          {word: 'farm', forms: [
            'farm',
            'farms',
            'farmed',
            'farming'
          ]},
          {word: 'grow', forms: [
            'grow',
            'grows',
            'grew',
            'growing'
          ]},
          {word: 'plow', forms: [
            'plow',
            'plows',
            'plowing',
            'plowed'
          ]}
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
  describe('removing parts of a contextpack during creation', () =>{

  });


  });
