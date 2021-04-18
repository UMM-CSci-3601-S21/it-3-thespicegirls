import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { ContextPackCardComponent } from 'src/app/contextpacks/contextpack-card/contextpack-card.component';
import { ContextPackListComponent } from 'src/app/contextpacks/contextpack-list/contextpack-list.component';
import { ContextPackService } from 'src/app/contextpacks/contextpack.service';
import { MockContextPackService } from 'src/testing/contextpack.service.mock';
import { MockLearnerService } from 'src/testing/learner.service.mock';
import { Learner } from '../learner';
import { LearnerService } from '../learner.service';

import { LearnerListComponent } from './learner-list.component';

const COMMON_IMPORTS: any[] = [
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatSnackBarModule,
  MatOptionModule,
  MatButtonModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatListModule,
  MatDividerModule,
  MatRadioModule,
  MatIconModule,
  BrowserAnimationsModule,
  RouterTestingModule,
  FormsModule,
  ReactiveFormsModule,
];

describe('LearnerListComponent', () => {
  let learnerList: LearnerListComponent;
  let fixture: ComponentFixture<LearnerListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [ContextPackListComponent, ContextPackCardComponent],

      providers: [{provide: LearnerService, useValue: new MockLearnerService()}]
    });
  });
  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(LearnerListComponent);
      learnerList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerListComponent);
    learnerList = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(learnerList).toBeTruthy();
  });

  it('contains all the Learners', () => {
    expect(learnerList.serverFilteredLearners.length).toBe(2);
  });

  it('contains a Learner named \'one\'', () => {
    expect(learnerList.serverFilteredLearners.some((learner: Learner) => learner.name === 'one')).toBe(true);
  });

  it('doesn\'t contain a Learner named \'three\'', () => {
    expect(learnerList.serverFilteredLearners.some((learner: Learner) => learner.name === 'three')).toBe(false);
  });
});

describe('Misbehaving ContextPack List', () => {
  let learnerList: LearnerListComponent;
  let fixture: ComponentFixture<LearnerListComponent>;

  let getLearnersSub: {
    getLearners: () => Observable<Learner[]>;
    getLearnersFilter: () => Observable<Learner[]>;
  };

  beforeEach(() => {
    getLearnersSub = {
      getLearners: () => new Observable(observer => {
        observer.error('Error-prone observable');
      }),
      getLearnersFilter: () => new Observable(observer => {
        observer.error('Error-prone observable');
      })
    };

    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [LearnerListComponent],
      providers: [{provide: LearnerService, useValue: getLearnersSub}]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(LearnerListComponent);
      learnerList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('generates an error if we don\'t set up the service', () => {
    expect(learnerList.serverFilteredLearners).toBeUndefined();
  });
});
