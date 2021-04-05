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


}
