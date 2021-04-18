import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Learner } from 'src/app/learners/learner';
import { LearnerService } from 'src/app/learners/learner.service';

@Injectable()
export class MockLearnerService extends LearnerService {

  static testLearners: Learner[] = [
    {
      _id: 'testLearner1',
      creator: 'KK',
      name: 'one',
      assignedContextPacks: ['oneId','twoId','threeId'],
      disabledWordlists: ['wordlistName1','wordlistName2','wordlistName3'],
    },
    {
      _id: 'testLearner2',
      creator: 'KK',
      name: 'two',
      assignedContextPacks: ['oneId','twoId','threeId'],
      disabledWordlists: ['wordlistName1','wordlistName2','wordlistName3'],
    }
  ];

  constructor() {
    super(null);
  }

  getLearners(): Observable<Learner[]> {
    return of(MockLearnerService.testLearners);
  }

  // getLearnerById(id: string): Observable<Learner> {
  //   if (id === MockLearnerService.testLearners[0]._id) {
  //     return of(MockLearnerService.testLearners[0]);
  //   } else {
  //     return of(null);
  //   }
  // }
}
