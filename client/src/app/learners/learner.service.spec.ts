import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Learner } from './learner';

import { LearnerService } from './learner.service';

describe('LearnerService', () => {

    let service: LearnerService;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    const testLearners: Learner[] = [
      {
        _id: 'testLearner1',
        userName: 'KK',
        name: 'one',
        assignedContextPacks: ['oneId','twoId','threeId'],
        disabledWordlists: ['wordlistName1','wordlistName2','wordlistName3'],
      },
      {
        _id: 'testLearner2',
        userName: 'KK',
        name: 'two',
        assignedContextPacks: ['oneId','twoId','threeId'],
        disabledWordlists: ['wordlistName1','wordlistName2','wordlistName3'],
      }
    ];

    beforeEach(() => {
      // Set up the mock handling of the HTTP requests
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      httpClient = TestBed.inject(HttpClient);
      httpTestingController = TestBed.inject(HttpTestingController);
      // Construct an instance of the service with the mock
      // HTTP client.
      service = new LearnerService(httpClient);
    });

    afterEach(() => {
      // After every test, assert that there are no more pending requests.
      httpTestingController.verify();
    });

    it('should be created', () => {
    expect(service).toBeTruthy();
    });

    it('getLearners() calls api/learners', () => {
      service.getLearners().subscribe(
        learners => expect(learners).toBe(testLearners)
      );

      const req = httpTestingController.expectOne(service.learnerUrl);
      expect(req.request.method).toEqual('GET');

      req.flush(testLearners);
    });

    it('getLearnerById() calls api/learners/:id', () => {
      const targetLearner: Learner = testLearners[0];
      const targetId: string = targetLearner._id;
      service.getLearnerById(targetId).subscribe(
        learner => expect(learner).toBe(targetLearner)
      );

      const expectedUrl: string = service.learnerUrl + '/' + targetId;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toEqual('GET');
      req.flush(targetLearner);
    });

    it('should make a correctly composed post request to the api', () => {
      const targetLearner: Learner = testLearners[0];
      service.assignWordlist('dogs', targetLearner, 'assign').subscribe(
        learner => expect(learner).toBe(targetLearner)
      );
      const req = httpTestingController.expectOne('/api/learners/testLearner1/assignWordlist?assign=dogs');
      expect(req.request.method).toEqual('GET');
      req.flush(targetLearner);
    });

    it('assignContextpack calls api/learners/:id/assignContextpack correctly', () => {
      const targetLearner: Learner = testLearners[0];
      service.assignContextpack(targetLearner, 'assign', 'testContextpackId').subscribe(
        learner => expect(learner).toBe(targetLearner)
      );
      const req = httpTestingController.expectOne('/api/learners/testLearner1/assignPack?assign=testContextpackId');
      expect(req.request.method).toEqual('POST');
      req.flush(targetLearner);
    });

    it('filterLearners() filters by name', () => {
      expect(testLearners.length).toBe(2);
      const learnerName = 'one';
      expect(service.filterLearners(testLearners, { name: learnerName }).length).toBe(1);
    });

    it('addLearner() should not accept an empty name', () => {
      const noName: Learner =  {
        _id: 'noNameId',
        userName: 'KK',
        name: '',
        assignedContextPacks: ['oneId','twoId','threeId'],
        disabledWordlists: ['wordlistName1','wordlistName2','wordlistName3'],
      };
      expect(service.addLearner(noName)).toBeFalsy();
    });

    it('addLearner() should not accept a name of just spaces', () => {
      const spaceName: Learner =  {
        _id: 'spaceNameId',
        userName: 'KK',
        name: '               ',
        assignedContextPacks: ['oneId','twoId','threeId'],
        disabledWordlists: ['wordlistName1','wordlistName2','wordlistName3'],
      };
      expect(service.addLearner(spaceName)).toBeFalsy();
    });

    it('addLearner() should accept the name David', () => {
      const david: Learner =  {
        _id: 'test',
        userName: 'KK',
        name: 'David',
        assignedContextPacks: ['oneId','twoId','threeId'],
        disabledWordlists: ['wordlistName1','wordlistName2','wordlistName3'],
      };

      expect(service.addLearner(david)).toBeTruthy();
    });

    it('addLearner() should accept a name surrounded by spaces', () => {
      const spaceDavid: Learner =  {
        _id: 'spaceDavidId',
        userName: 'KK',
        name: '     David        ',
        assignedContextPacks: ['oneId','twoId','threeId'],
        disabledWordlists: ['wordlistName1','wordlistName2','wordlistName3'],
      };

      expect(service.addLearner(spaceDavid)).toBeTruthy();
    });

    it('addLearner() posts to api/learners', () => {

      service.addLearner(testLearners[1]).subscribe(
        id => expect(id).toBe('testid')
      );

      const req = httpTestingController.expectOne(service.learnerUrl);

      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(testLearners[1]);

      req.flush({id: 'testid'});
    });
});
