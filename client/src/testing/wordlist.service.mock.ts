import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Wordlist, Word } from '../app/wordlists/wordlist';
import { WordlistService } from '../app/wordlists/wordlist.service';

/**
 * A "mock" version of the `WordlistService` that can be used to test components
 * without having to create an actual service.
 */
@Injectable()
export class MockWordlistService extends WordlistService {
  static noun: Word = {
    word: 'you',
    forms: ['yoyo', 'yos']
  };
  static adjective: Word = {
    word: 'green',
    forms: ['greens', 'greener']
  };
  static verb: Word = {
    word: 'ran',
    forms: ['running']
  };
  static misc: Word = {
    word: 'langerhans',
    forms: ['langerhan']
  };
  static testNouns: Word[] = [MockWordlistService.noun];
  static testVerbs: Word[] = [MockWordlistService.verb];
  static testAdjectives: Word[] = [MockWordlistService.adjective];
  static testMisc: Word[] = [MockWordlistService.misc];

  static testWordlists: Wordlist[] = [
    {
      _id: 'chris_id',
      enabled: true,
      topic: 'fun',
      nouns: MockWordlistService.testNouns,
      verbs: MockWordlistService.testVerbs,
      adjectives: MockWordlistService.testAdjectives,
      misc: MockWordlistService.testMisc
    },
    {
      _id: 'pat_id',
      enabled: false,
      topic: 'happy',
      nouns: MockWordlistService.testNouns,
      verbs: MockWordlistService.testVerbs,
      adjectives: MockWordlistService.testAdjectives,
      misc: MockWordlistService.testMisc
    },
    {
      _id: 'jamie_id',
      enabled: true,
      topic: 'sun',
      nouns: MockWordlistService.testNouns,
      verbs: MockWordlistService.testVerbs,
      adjectives: MockWordlistService.testAdjectives,
      misc: MockWordlistService.testMisc
    }
  ];

  constructor() {
    super(null);
  }

  getWordlists(): Observable<Wordlist[]> {
    // Just return the test users regardless of what filters are passed in
    return of(MockWordlistService.testWordlists);
  }

  getWordlistById(id: string): Observable<Wordlist> {
    // If the specified ID is for the first test user,
    // return that user, otherwise return `null` so
    // we can test illegal user requests.
    if (id === MockWordlistService.testWordlists[0]._id) {
      return of(MockWordlistService.testWordlists[0]);
    } else {
      return of(null);
    }
  }

}
