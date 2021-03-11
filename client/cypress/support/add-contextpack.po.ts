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
    return select.click()
      // Select and click the desired value from the resulting menu
      .get(`mat-option[value="${value}"]`).click();
  }

  getFormField(fieldName: string) {
    return cy.get(`mat-form-field [formcontrolname=${fieldName}]`);
  }

  addWordlist(){
    return cy.get('.add-wordlist-button').click();
  }
  addPosArray(pos: string){
    return cy.get(`.add-${pos}-button`).click();
  }
  contextPackForm(){
    return cy.get('.form-value');
  }




  addPack(newPack: ContextPack) {
    this.getFormField('name').type(newPack.name);
    this.getFormField('enabled').click();
    if (newPack.wordlists) {
      this.getFormField('wordlists').get('name').type(newPack.wordlists[0].name);
    }
    if (newPack.wordlists[0].nouns) {
      this.getFormField('wordlists').get('nouns')[0].get('word').type(newPack.wordlists[0].nouns[0].word);
    }
    this.selectMatSelectValue(this.getFormField('enabled'), newPack.enabled.toString());
    return this.addPackButton().click();
  }
}
