import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContextpacksComponent } from './add-contextpacks.component';

describe('AddContextpacksComponent', () => {
  let component: AddContextpacksComponent;
  let fixture: ComponentFixture<AddContextpacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddContextpacksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContextpacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
