/* eslint-disable @typescript-eslint/naming-convention */
import {ContextPack} from 'src/app/contextpacks/contextpack';

export class AddPackPage {
  navigateTo() {
    return cy.visit('/edit');
  }

  getTitle() {
    return cy.get('.add-pack-title');
  }

  addPackButton() {
    return cy.get('[data-test="confirmAddPackButton"]');
  }

  selectMatSelectValue(select: Cypress.Chainable, value: string) {
    // Find and click the drop down
    return select.click({ multiple: true, force:true })
      // Select and click the desired value from the resulting menu
      .get(`mat-option[value="${value}"]`).click({ multiple: true, force:true });
  }

  getFormField(fieldName: string) {
    return cy.get(`mat-form-field [formcontrolname=${fieldName}]`);
  }

  addWordlist(){
    return cy.get('.add-wordlist-button').click({force: true});
  }
  addPosArray(pos: string){
    return cy.get(`.add-${pos}-button`).click({force: true});
  }
  showJson(){
    return cy.get('[data-test="showJsonButton"]').click({force: true});
  }
  contextPackForm(){
    return cy.get('.form-value');
  }




  addPack(newPack: ContextPack) {
    this.getFormField('name').type(newPack.name);
    this.getFormField('enabled').click({force: true});
    this.addWordlist();
    this.addPosArray('noun');
    this.addPosArray('verb');
    this.addPosArray('adj');
    this.addPosArray('misc');
    if (newPack.wordlists) {
      this.getFormField('name').then(els => {
        [...els].forEach(el => cy.wrap(el).type('horsies', {force:true}));
      });
    }
    this.selectMatSelectValue(this.getFormField('enabled'), newPack.enabled.toString());
    return this.addPackButton().click({ multiple: true, force:true });
  }

  googleLogin(){
    cy.log('Logging in to Google');
  cy.request({
    method: 'POST',
    url: 'https://www.googleapis.com/oauth2/v4/token',
    body: {
      grant_type: 'refresh_token',
      client_id: '239479898228-jsa8kqtcnqg96v8r74j2mp9jbbp01scu.apps.googleusercontent.com',
      client_secret: 'fYWuoPB8RyEX4FWUxVhPFdUI',
      refresh_token: '1//04kdq6BjVCbofCgYIARAAGAQSNwF-L9Ir5KLmutY2ti0WeoJqeRt_924wi3JuxOjJPvmkH6NlR0yUYo7wyNizniJQVywHMbgLJkE',
    },
  }).then(({ body }) => {
    const { access_token, id_token } = body;

    cy.request({
      method: 'GET',
      url: 'https://www.googleapis.com/oauth2/v3/userinfo',
      headers: { Authorization: `Bearer ${access_token}` },
    // eslint-disable-next-line no-shadow
    }).then(({ body }) => {
      cy.log(body);
      const userItem = {
        token: id_token,
        user: {
          googleId: body.sub,
          email: body.email,
          email_verified: body.email_verified,
          givenName: body.given_name,
          familyName: body.family_name,
          imageUrl: body.picture,
        },
      };

      cy.request('POST', 'api/users', id_token ).then(
  (response) => {

  }
);
      this.navigateTo();
    });
  });

  }
}
