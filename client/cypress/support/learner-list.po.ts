export class LearnerListPage {
  navigateTo() {
    return cy.visit('/learner');
  }

  getLearnerCards() {
    return cy.get('.learner-card');
  }
  getEnabledWordlists(){
    return cy.get('.assigned-wordlists');
  }
  getDisabledWordlists(){
    return cy.get('.disabled-wordlists');
  }
  getAssignedWords(){
    const assignedWords=[];
    for(const pos of ['nouns','verbs','adjectives']){
      assignedWords.push(cy.get(`.${pos}`));
    }
    return assignedWords;
  }
  assignWordlist(){
    return cy.get('.wordlist-select').click();
  }


  /**
   * Clicks the "view info" button for the given contextpack card.
   * Requires being in the "card" view.
   *
   * @param card The contextpack card
   */
  clickViewInfo(card: Cypress.Chainable<JQuery<HTMLElement>>) {
    return card.find<HTMLButtonElement>('[data-test=viewInfoButton]').click();
  }
  enableEditDeleteMode(){
    return cy.get('.editView').click({force: true});
  }

  enableAddMode(){
    return cy.get('.addView').click({force: true});
  }

}
