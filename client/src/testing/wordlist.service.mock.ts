import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Wordlist } from '../app/wordlists/wordlist';
import { WordlistService } from '../app/wordlists/wordlist.service';

/**
 * A "mock" version of the `WordlistService` that can be used to test components
 * without having to create an actual service.
 */
@Injectable()
export class MockWordlistService extends WordlistService {
  static testWordlists: Wordlist[] = [
    {
      _id: 'chris_id',
      enabled: true,
      topic: 'fun',
      nouns: ['yo'],
      verbs: ['yo'],
      adjectives: ['yo'],
      misc: ['yo']
    },
    {
      _id: 'pat_id',
      enabled: false,
      topic: 'fun',
      nouns: ['yo'],
      verbs: ['yo'],
      adjectives: ['yo'],
      misc: ['yo']
    },
    {
      _id: 'jamie_id',
      enabled: true,
      topic: 'fun',
      nouns: ['yo'],
      verbs: ['yo'],
      adjectives: ['yo'],
      misc: ['yo']
    }
  ];

  constructor() {
    super(null);
  }

  getWordlists(filters: { topic?: string }): Observable<Wordlist[]> {
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
