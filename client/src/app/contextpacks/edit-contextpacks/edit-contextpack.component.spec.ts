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
  describe('the click to edit functions', ()=>{
    it('should cancel editing when prompted', ()=>{
      // editing mode should be false to begin with
      expect(component.isEditing).toBeFalsy();
      component.edit();
      // Calling the edit function should change is editing to true
      expect(component.isEditing).toBeTruthy();
      component.cancel();
      // Canceling edit should turn isEditing to be false
      expect(component.isEditing).toBeFalsy();
      component.processChanges();
      expect(component.isEditing).toBeFalsy();

    });
  });
});
