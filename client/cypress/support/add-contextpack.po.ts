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
  getJsonTab() {
    return cy.get(`.mat-tab-label`).click({multiple: true,force: true});
  }


  addWordlist(){
    return cy.get('.add-wordlist-button').click({force: true});
  }
  addPosArray(pos: string){
    return cy.get(`.add-${pos}-button`).click({force: true});
  }
  showJson(fieldName: number){
    return cy.get(`mat-tab`).click({force: true});;
  }
  contextPackForm(){
    return cy.get('.form-value');
  }





  addPack(newPack: ContextPack) {
    this.getFormField('name').type(newPack.name);
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
    return this.addPackButton().click({ multiple: true, force:true });
  }
}
