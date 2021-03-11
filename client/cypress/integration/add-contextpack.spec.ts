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

  it('Should add parts of speech when buttons are pushed', () => {
    // ADD USER button should be disabled until all the necessary fields
    // are filled. Once the last (`#emailField`) is filled, then the button should
    // become enabled.
    page.addPackButton().should('be.disabled');
    page.getFormField('name').type('test');
    page.addPackButton().should('be.enabled');
    page.addWordlist();
    page.contextPackForm().should('contain', 'nouns');
    page.addPosArray(`noun`);
    page.contextPackForm().should('contain', 'nouns');
  });
  



  });
