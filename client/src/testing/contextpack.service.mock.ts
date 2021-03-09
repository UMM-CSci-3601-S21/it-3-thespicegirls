import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Contextpack, Word } from '../app/contextpacks/contextpack';
import { ContextpackService } from '../app/contextpacks/contextpack.service';

/**
 * A "mock" version of the `ContextpackService` that can be used to test components
 * without having to create an actual service.
 */
@Injectable()
export class MockContextpackService extends ContextpackService {
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

  static testContextpacks: Contextpack[] = [
    {
      _id: 'chris_id',
      enabled: true,
      topic: 'fun',
      nouns: MockContextpackService.testNouns,
      verbs: MockContextpackService.testVerbs,
      adjectives: MockContextpackService.testAdjectives,
      misc: MockContextpackService.testMisc
    },
    {
      _id: 'pat_id',
      enabled: false,
      topic: 'happy',
      nouns: MockContextpackService.testNouns,
      verbs: MockContextpackService.testVerbs,
      adjectives: MockContextpackService.testAdjectives,
      misc: MockContextpackService.testMisc
    },
    {
      _id: 'jamie_id',
      enabled: true,
      topic: 'sun',
      nouns: MockContextpackService.testNouns,
      verbs: MockContextpackService.testVerbs,
      adjectives: MockContextpackService.testAdjectives,
      misc: MockContextpackService.testMisc
    }
  ];

  constructor() {
    super(null);
  }

  getContextpacks(): Observable<Contextpack[]> {
    // Just return the test users regardless of what filters are passed in
    return of(MockContextpackService.testContextpacks);
  }

  getContextpackById(id: string): Observable<Contextpack> {
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
