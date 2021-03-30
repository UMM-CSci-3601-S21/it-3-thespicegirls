import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ContextPack, Word, Wordlist } from '../app/contextpacks/contextpack';
import { ContextPackService } from '../app/contextpacks/contextpack.service';

/**
 * A "mock" version of the `ContextpackService` that can be used to test components
 * without having to create an actual service.
 */
@Injectable()
export class MockContextPackService extends ContextPackService {
  static noun: Word = {
    word: 'you',
    forms: ['you', 'yos']
  };
  static adjective: Word = {
    word: 'green',
    forms: ['green', 'greener']
  };
  static verb: Word = {
    word: 'ran',
    forms: ['ran', 'running']
  };
  static misc: Word = {
    word: 'langerhans',
    forms: ['langerhans']
  };

  static testNouns: Word[] = [MockContextPackService.noun];
  static testVerbs: Word[] = [MockContextPackService.verb];
  static testAdjectives: Word[] = [MockContextPackService.adjective];
  static testMisc: Word[] = [MockContextPackService.misc];

  static testWordlists: Wordlist[] =
    [
      {
        name: 'happy',
        enabled: false,
        nouns: MockContextPackService.testNouns,
        adjectives: MockContextPackService.testAdjectives,
        verbs: MockContextPackService.testVerbs,
        misc: MockContextPackService.testMisc
      }
  ];

  static testContextPacks: ContextPack[] = [
    {
      _id: 'chris_id',
      enabled: true,
      name: 'fun',
      wordlists: MockContextPackService.testWordlists
    },
    {
      _id: 'bob_id',
      enabled: true,
      name: 'sun',
      wordlists: MockContextPackService.testWordlists
    },
    {
      _id: 'mary_id',
      enabled: true,
      name: 'happy',
      wordlists: MockContextPackService.testWordlists
    }
  ];

  constructor() {
    super(null);
  }

  getContextPacks(): Observable<ContextPack[]> {
    // Just return the test contextpacks regardless of what filters are passed in
    return of(MockContextPackService.testContextPacks);
  }

  getContextPackById(id: string): Observable<ContextPack> {
    // If the specified ID is for the first test contextpack,
    // return that contextpack, otherwise return `null` so
    // we can test illegal contextpack requests.
    if (id === MockContextPackService.testContextPacks[0]._id) {
      return of(MockContextPackService.testContextPacks[0]);
    } else {
      return of(null);
    }
  }

  updateWordList(contextpack: ContextPack, listname: string,
  editValues?: {name?: string; enabled?: string},
  addValues?: { noun?: string; verb?: string; adjective?: string; misc?: string},
  delValues?: { noun?: string; verb?: string; adjective?: string; misc?: string}): Observable<ContextPack> {

    if(editValues.name){MockContextPackService.testContextPacks[0].wordlists[0].name = editValues.name;}
    if(editValues.enabled){
      switch(editValues.enabled){
        case 'false' :
        MockContextPackService.testContextPacks[0].wordlists[0].enabled = false;
        break;
        case 'true' :
        MockContextPackService.testContextPacks[0].wordlists[0].enabled = true;
        break; }}
    if(addValues.noun){
      const newWord: Word = null;
      const tmp = addValues.noun.split(',');
      newWord.word = tmp[0];
      newWord.forms = tmp;
      MockContextPackService.testContextPacks[0].wordlists[0].nouns.push(newWord);}
    if(addValues.verb){
      const newWord: Word = null;
      const tmp = addValues.verb.split(',');
      newWord.word = tmp[0];
      newWord.forms = tmp;
      MockContextPackService.testContextPacks[0].wordlists[0].verbs.push(newWord);}
    if(addValues.adjective){
      const newWord: Word = null;
      const tmp = addValues.adjective.split(',');
      newWord.word = tmp[0];
      newWord.forms = tmp;
      MockContextPackService.testContextPacks[0].wordlists[0].adjectives.push(newWord);}
    if(addValues.misc){
      const newWord: Word = null;
      const tmp = addValues.misc.split(',');
      newWord.word = tmp[0];
      newWord.forms = tmp;
      MockContextPackService.testContextPacks[0].wordlists[0].misc.push(newWord);}
    if(delValues.noun){
      delete MockContextPackService.testContextPacks[0].wordlists[0].nouns[0].word [delValues.noun];
    }
    if(delValues.verb){
      delete MockContextPackService.testContextPacks[0].wordlists[0].verbs[0].word [delValues.verb];
    }
    if(delValues.adjective){
      delete MockContextPackService.testContextPacks[0].wordlists[0].adjectives[0].word [delValues.adjective];
    }
    if(delValues.misc){
      delete MockContextPackService.testContextPacks[0].wordlists[0].misc[0].word [delValues.misc];
    }
    return new Observable<ContextPack>();
  }

  updateContextPack(contextpack: ContextPack, newValues?: {name?: string; enabled?: string; icon?: string}): Observable<ContextPack> {
    if(newValues.name){
      MockContextPackService.testContextPacks[0].name = newValues.name;
    }
    if(newValues.icon){
      MockContextPackService.testContextPacks[0].icon = newValues.icon;
    }
    if(newValues.enabled){
      switch(newValues.enabled){
        case 'false' :
        MockContextPackService.testContextPacks[0].enabled = false;
        break;
        case 'true' :
        MockContextPackService.testContextPacks[0].enabled = true;
        break;
      }}
    return new Observable<ContextPack>();
  }

  addForms(contextpack: ContextPack, listname: string,
    addForms: {noun?: string; verb?: string; adjective?: string; misc?: string}): Observable<ContextPack> {

    if(addForms.noun){
      let tmp = MockContextPackService.testContextPacks[0].wordlists[0].nouns[0].forms.join(',');
      tmp = tmp + addForms.noun; //wasn't letting me join two arrays using push so I went the long way
      MockContextPackService.testContextPacks[0].wordlists[0].nouns[0].forms = tmp.split(','); }
    if(addForms.verb){
      let tmp = MockContextPackService.testContextPacks[0].wordlists[0].verbs[0].forms.join(',');
      tmp = tmp + addForms.verb;
      MockContextPackService.testContextPacks[0].wordlists[0].verbs[0].forms = tmp.split(','); }
    if(addForms.adjective){
      let tmp = MockContextPackService.testContextPacks[0].wordlists[0].adjectives[0].forms.join(',');
      tmp = tmp + addForms.adjective;
      MockContextPackService.testContextPacks[0].wordlists[0].adjectives[0].forms = tmp.split(',');
    }
    if(addForms.misc){
      let tmp = MockContextPackService.testContextPacks[0].wordlists[0].misc[0].forms.join(',');
      tmp = tmp + addForms.misc;
      MockContextPackService.testContextPacks[0].wordlists[0].misc[0].forms = tmp.split(',');
    }
    return new Observable<ContextPack>();
  }

}
