import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Learner } from 'src/app/learners/learner';
import { LearnerService } from 'src/app/learners/learner.service';

@Injectable()
export class MockLearnerService extends LearnerService {

  static testLearners: Learner[] = [
    {
      _id: 'testLearner1',
      userId: 'KK',
      name: 'one',
      assignedContextPacks: ['chris_id'],
      disabledWordlists: ['wordlistName1','wordlistName2','wordlistName3'],
    },
    {
      _id: 'testLearner2',
      userId: 'KK',
      name: 'two',
      assignedContextPacks: ['chris_id','bob_id','mary_id'],
      disabledWordlists: ['wordlistName1','wordlistName2','wordlistName3'],
    }
  ];

  constructor() {
    super(null);
  }

  getLearners(): Observable<Learner[]> {
    return of(MockLearnerService.testLearners);
  }

  getLearnerById(id: string): Observable<Learner> {
    if (id === MockLearnerService.testLearners[0]._id) {
      return of(MockLearnerService.testLearners[0]);
    }
  }
  assignWordlist(listname: string ,learner: Learner){
    return of(MockLearnerService.testLearners[0]);
  }


}
