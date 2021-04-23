import { compileNgModule } from '@angular/compiler';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ContextPackService } from 'src/app/contextpacks/contextpack.service';
import { ActivatedRouteStub } from 'src/testing/activated-route-stub';
import { MockContextPackService } from 'src/testing/contextpack.service.mock';
import { MockLearnerService } from 'src/testing/learner.service.mock';
import { LearnerService } from '../learner.service';

import { LearnerInfoComponent } from './learner-info.component';

describe('LearnerInfoComponent', () => {
  let component: LearnerInfoComponent;
  let fixture: ComponentFixture<LearnerInfoComponent>;
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatCardModule,
        MatSnackBarModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      declarations: [ LearnerInfoComponent ],
      providers: [
        { provide: LearnerService, useValue: new MockLearnerService() },
        { provide: ContextPackService, useValue: new MockContextPackService() },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]

    })
    .compileComponents();
  });

  beforeEach(() => {

    fixture = TestBed.createComponent(LearnerInfoComponent);
    component = fixture.componentInstance;
    component.learner = {
      _id: 'learner',
      creator: 'string',
      name: 'string',
      assignedContextPacks: ['chris_id','chris_id'],
      disabledWordlists: ['happy','moooo','sun']
    };
    activatedRoute.setParamMap({ id: 'testLearner1' });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should navigate to a specific Learner\'s info page', () => {
    activatedRoute.setParamMap({ id: 'testLearner1' });
    expect(component.id).toEqual('testLearner1');
  });

  it('should get assigned context packs', () => {
    component.getAssignedContextPacks();
    component.learner = {
      _id: 'learner',
      creator: 'string',
      name: 'string',
      assignedContextPacks: ['chris_id','bob_id', 'mary_id'],
      disabledWordlists: []
    };
    expect(component.assignedPacks.length).toBeGreaterThan(0);
    expect(component.assignedPacks[0]._id).toEqual('chris_id');
    expect(component.assignedPacks[0]._id).toEqual('chris_id');
  });
  it('should assign wordlists', () => {
    component.getAssignedWordlists(MockContextPackService.testContextPacks[1]);
    component.setWordlists(MockContextPackService.testContextPacks[1]);
    expect(component.possibleWordlists.includes(MockContextPackService.testContextPacks[1].wordlists[0]));
  });

  it('should correctly update the view after a wordlist is assigned', () => {
    component.learner.disabledWordlists =['sun'];
    const assignedPackInfo = {
      contextpack: MockContextPackService.testContextPacks2[1],
      assignedWordlists: [{
        name: 'happy',
        enabled: true,
        nouns: MockContextPackService.testNouns,
        adjectives: MockContextPackService.testAdjectives,
        verbs: MockContextPackService.testVerbs,
        misc: MockContextPackService.testMisc
      }
    ]
    };

    component.getAssignedContextPacks();
    const list =MockContextPackService.testContextPacks2[1].wordlists[0];
    component.toggleWordlist(list ,MockContextPackService.testContextPacks2[1],list.enabled);
    component.assignedPacksTest.push(assignedPackInfo);
    expect(component.assignedPacksTest).toContain(assignedPackInfo);
    expect(component.assignedWords).toContain(MockContextPackService.testNouns[0]);
    expect(list.enabled).toBe(false);
    component.setWordlists(MockContextPackService.testContextPacks2[2]);
  });
  describe('',()=>{
    beforeEach(() => {

      fixture = TestBed.createComponent(LearnerInfoComponent);
      component = fixture.componentInstance;
      component.learner = {
        _id: 'learner',
        creator: 'string',
        name: 'string',
        assignedContextPacks: ['chris_id','chris_id'],
        disabledWordlists: ['moooo','sun']
      };
      activatedRoute.setParamMap({ id: 'testLearner1' });
      fixture.detectChanges();
    });
    it('should correctly update the view after a wordlist is assigned', () => {
      component.learner.disabledWordlists =[];
      const assignedPackInfo = {
        contextpack: MockContextPackService.testContextPacks[1],
        assignedWordlists: [{
          name: 'happy',
          enabled: false,
          nouns: MockContextPackService.testNouns,
          adjectives: MockContextPackService.testAdjectives,
          verbs: MockContextPackService.testVerbs,
          misc: MockContextPackService.testMisc
        }
      ]
      };
      component.getAssignedContextPacks();
      const list =MockContextPackService.testContextPacks[1].wordlists[0];
      component.toggleWordlist(list ,MockContextPackService.testContextPacks[1],false);
      component.assignedPacksTest.push(assignedPackInfo);
      expect(component.assignedPacksTest).toContain(assignedPackInfo);
      expect(component.assignedWords).toContain(MockContextPackService.testNouns[0]);
      expect(list.enabled).toBe(true);
    });
    it('should correctly update the view after a wordlist is assigned', () => {
      component.learner.disabledWordlists =['milk'];
      const assignedPackInfo = {
        contextpack: MockContextPackService.testContextPacks[1],
        assignedWordlists: [{
          name: 'happy',
          enabled: false,
          nouns: MockContextPackService.testNouns,
          adjectives: MockContextPackService.testAdjectives,
          verbs: MockContextPackService.testVerbs,
          misc: MockContextPackService.testMisc
        }
      ]
      };
      component.getAssignedContextPacks();
      const list ={
        name: 'happy',
        enabled: false,
        nouns: MockContextPackService.testNouns,
        adjectives: MockContextPackService.testAdjectives,
        verbs: MockContextPackService.testVerbs,
        misc: MockContextPackService.testMisc
      };
      component.toggleWordlist(list ,MockContextPackService.testContextPacks[1],false);
      component.assignedPacksTest.push(assignedPackInfo);
      expect(component.assignedPacksTest).toContain(assignedPackInfo);
      expect(component.assignedWords).toContain(MockContextPackService.testNouns[0]);
      expect(list.enabled).toBe(true);
    });

  });





});
