import { HttpClient } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { ngfactoryFilePath } from '@angular/compiler/src/aot/util';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ContextPack, Word, Wordlist } from 'src/app/contextpacks/contextpack';
import { ContextPackService } from 'src/app/contextpacks/contextpack.service';
import { ActivatedRouteStub } from 'src/testing/activated-route-stub';
import { MockContextPackService } from 'src/testing/contextpack.service.mock';
import { MockLearnerService } from 'src/testing/learner.service.mock';
import { LearnerListComponent } from '../learner-list/learner-list.component';
import { LearnerService } from '../learner.service';

import { LearnerCardComponent } from './learner-card.component';


describe('LearnerCardComponent', () => {
  let component: LearnerCardComponent;
  let fixture: ComponentFixture<LearnerCardComponent>;
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatCardModule,
        MatSnackBarModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [LearnerListComponent, LearnerCardComponent],
      providers: [
        {provide: LearnerService, useValue: new MockLearnerService()},
        { provide: ContextPackService, useValue: new MockContextPackService() }
      ]
    })
      .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerCardComponent);
    component = fixture.componentInstance;
    component.learner = {
      _id: 'learner',
      creator: 'string',
      name: 'string',
      assignedContextPacks: ['chris_id','chris_id'],
      disabledWordlists: []
    };
    fixture.detectChanges();
  });
  beforeEach(() => {



    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
