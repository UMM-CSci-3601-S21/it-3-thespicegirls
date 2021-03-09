import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ContextPack, Word, Wordlist } from '../app/contextpacks/contextpack';
import { ContextPackService } from '../app/contextpacks/contextpack.service';

/**
 * A "mock" version of the `ContextpackService` that can be used to test components
 * without having to create an actual service.
 */
@Injectable()
export class MockContextpackService extends ContextPackService {
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

  static testNouns: Word[] = [MockContextpackService.noun];
  static testVerbs: Word[] = [MockContextpackService.verb];
  static testAdjectives: Word[] = [MockContextpackService.adjective];
  static testMisc: Word[] = [MockContextpackService.misc];

  static testWordlists: Wordlist[] =
    [
      {
        enabled: false,
        name: 'happy',
        nouns: MockContextpackService.testNouns,
        verbs: MockContextpackService.testVerbs,
        adjectives: MockContextpackService.testAdjectives,
        misc: MockContextpackService.testMisc
      }

  ];




  static testContextpacks: ContextPack[] = [
    {
      _id: 'chris_id',
      enabled: true,
      name: 'fun',
      wordlists: MockContextpackService.testWordlists
    },
    {
      _id: 'chris_id',
      enabled: true,
      name: 'fun',
      wordlists: MockContextpackService.testWordlists
    },
    {
      _id: 'chris_id',
      enabled: true,
      name: 'fun',
      wordlists: MockContextpackService.testWordlists
    }
  ];

  constructor() {
    super(null);
  }

  getContextpacks(): Observable<ContextPack[]> {
    // Just return the test users regardless of what filters are passed in
    return of(MockContextpackService.testContextpacks);
  }

  getContextpackById(id: string): Observable<ContextPack> {
    // If the specified ID is for the first test user,
    // return that user, otherwise return `null` so
    // we can test illegal user requests.
    if (id === MockContextpackService.testContextpacks[0]._id) {
      return of(MockContextpackService.testContextpacks[0]);
    } else {
      return of(null);
    }
  }

}
