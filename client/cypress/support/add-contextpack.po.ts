/* eslint-disable @typescript-eslint/naming-convention */
import {ContextPack} from 'src/app/contextpacks/contextpack';
const half1 = 'mAXr0aPv9HU2';
const half2 = 'ZqzYWTm6o3-n';
const secret = half1 + half2;
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

  getJsonTab() {
    return cy.get(`.mat-tab-label`).click({multiple: true,force: true});
  }


  addWordlist(){
    return cy.get('.add-wordlist-button').click({force: true});
  }
  addPosArray(pos: string){
    return cy.get(`.add-${pos}-button`).click({force: true});
  }

  contextPackForm(){
    return cy.get('.form-value');
  }

  addPack(newPack: ContextPack) {
    this.getFormField('name').type(newPack.name);
    let index = 1;
    for(const wordlist of newPack.wordlists){
    this.addWordlist();
    this.getFormField('name').eq(index).type(wordlist.name);
    index++;
    let w = 0;
    let i = 0;
    for(const wordPos of [wordlist.nouns,wordlist.verbs,wordlist.adjectives,wordlist.misc]){
      const accordions = ['.noun-accordion','.verb-accordion','.adjective-accordion','.misc-accordion'];
      let a = 0;
    for(const word of wordPos){
      const arrayOptions = ['noun','verb','adjective','misc'];
      const inputOptions = ['.nounInput','.verbInput','.adjectiveInput','.miscInput'];
      const formOptions = ['.nounForm','.verbForm','.adjectiveForm','.miscForm'];
      cy.get(accordions[i]).click();
      this.addPosArray(arrayOptions[i]);
      cy.get(inputOptions[i]).type(word.word);
      let f = 0;
      for(const form of word.forms){
        cy.get('.add-button').eq(w).click();
        cy.get(formOptions[i]).eq(f).type(form);
        f++;
      }
      w++;
      a++;
    }
    i++;
  }
}
    return this.addPackButton().click({ multiple: true, force:true });
}



  googleLogin(){
  cy.request({
    method: 'POST',
    url: 'https://www.googleapis.com/oauth2/v4/token',
    body: {
      grant_type: 'refresh_token',
      client_id: '239479898228-jsa8kqtcnqg96v8r74j2mp9jbbp01scu.apps.googleusercontent.com',
      client_secret: secret,
      refresh_token: '1//04PtCRYlxcBhaCgYIARAAGAQSNwF-L9IreHQjyhF-I-dhSUXxeumuvI8gkohBwRfSPp7f_PxGL-TvHaKU7zTF6vlUXpz5DaMYK68',
    },
  }).then(this.googleMethod());
  }

  googleAdminLogin(){
  cy.request({
    method: 'POST',
    url: 'https://www.googleapis.com/oauth2/v4/token',
    body: {
      grant_type: 'refresh_token',
      client_id: '239479898228-jsa8kqtcnqg96v8r74j2mp9jbbp01scu.apps.googleusercontent.com',
      client_secret: secret,
      refresh_token: '1//04waMMGEB5ZeYCgYIARAAGAQSNwF-L9Ir-i0RDTKrc64pPSiG3exu4kMvfo0R5LmnKJWAFBOsJ98PrY3UsL1jIRv9Zih1vaBMxfY',
    },
  }).then(this.googleMethod());
  }

  private googleMethod(): (this: Cypress.ObjectLike, currentSubject: Cypress.Response) => void {
    return ({ body }) => {
      const { access_token, id_token } = body;
      cy.request({
        method: 'GET',
        url: 'https://www.googleapis.com/oauth2/v3/userinfo',
        headers: { Authorization: `Bearer ${access_token}` },
        // eslint-disable-next-line no-shadow
      }).then(({ body }) => {
        cy.request('POST', 'api/users', id_token).then(
          (response) => {
          }
        );
      });
    };
  }
}
