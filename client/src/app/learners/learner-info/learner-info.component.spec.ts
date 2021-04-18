import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerInfoComponent } from './learner-info.component';

describe('LearnerInfoComponent', () => {
  let component: LearnerInfoComponent;
  let fixture: ComponentFixture<LearnerInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearnerInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
