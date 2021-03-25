import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditContextpackComponent } from './edit-contextpack.component';

describe('EditContextpackComponent', () => {
  let component: EditContextpackComponent;
  let fixture: ComponentFixture<EditContextpackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditContextpackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditContextpackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
