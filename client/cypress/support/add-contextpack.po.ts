

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

  addUser(newUser: User) {
    this.getFormField('name').type(newUser.name);
    this.getFormField('age').type(newUser.age.toString());
    if (newUser.company) {
      this.getFormField('company').type(newUser.company);
    }
    if (newUser.email) {
      this.getFormField('email').type(newUser.email);
    }
    this.selectMatSelectValue(this.getFormField('role'), newUser.role);
    return this.addPackButton().click();
  }
}
