import { User } from 'src/app/users/user';
import { AddUserPage } from '../support/add-user.po';

describe('Add a Context pack', () => {
  const page = new AddUserPage();

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getTitle().should('have.text', 'New User');
  });

  it('Should enable and disable the add user button', () => {

  });


  });
