import { compileComponentFromMetadata } from '@angular/compiler';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormGroup, AbstractControl, FormArray } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockContextPackService } from 'src/testing/contextpack.service.mock';

import { AddContextpacksComponent } from './add-contextpacks.component';
import { ContextPackService } from './contextpack.service';

describe('AddContextpacksComponent', () => {
  let component: AddContextpacksComponent;
  let addPackForm: FormGroup;
  let fixture: ComponentFixture<AddContextpacksComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      declarations: [ AddContextpacksComponent ],
      providers: [{ provide: ContextPackService, useValue: new MockContextPackService() }]
    })
    .compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContextpacksComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
    addPackForm = component.contextPackForm;
    expect(addPackForm).toBeDefined();
    expect(addPackForm.controls).toBeDefined();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(addPackForm).toBeTruthy();
  });
  it('form should be invalid when empty', () => {
    expect(addPackForm.valid).toBeFalsy();
  });

  describe('the pack name field', () => {
    let nameControl: AbstractControl;

    beforeEach(() => {
      nameControl = component.contextPackForm.controls.name;
    });

    it('should not allow empty names', () => {
      nameControl.setValue('');
      expect(nameControl.valid).toBeFalsy();
    });

    it('should be fine with "Jojo Siwa"', () => {
      nameControl.setValue('Jojo Siwa');
      expect(nameControl.valid).toBeTruthy();
    });

    it('should allow digits in the name', () => {
      nameControl.setValue('559546sd');
      expect(nameControl.valid).toBeTruthy();
    });

  });

  describe('The enabled field', () =>{
    let enabledControl: AbstractControl;
    beforeEach(() => {
      enabledControl = component.contextPackForm.controls.enabled;
    });
    it('should only allow boolean values', () => {
      enabledControl.setValue('559546sd');
      expect(enabledControl.valid).toBeFalsy();
      enabledControl.setValue('true');
      expect(enabledControl.valid).toBeTruthy();
      enabledControl.setValue('True');
      expect(enabledControl.valid).toBeFalsy();
      enabledControl.setValue('false');
      expect(enabledControl.valid).toBeTruthy();
    });
  });
  describe('Add wordlist', () =>{
    it('should add a wordlist when prompted', () =>{
      component.addWordlist();
      let formValue = component.contextPackForm.value;
      expect(formValue.wordlists.length).toBeGreaterThan(1);
      component.addWordlist();
      formValue = component.contextPackForm.value;
      expect(formValue.wordlists.length).toBeGreaterThan(2);
    });
  });
  describe('Add nouns', () =>{
    it('should add an array of nouns when prompted', () =>{

      component.addWordlist();
      component.addPosArray(0, 'nouns');
      let control = ((component.contextPackForm.value.wordlists as Array<any>)[0]);
      console.log(control.nouns);
      expect(control.nouns.length).toBeGreaterThan(1);
      // Add 2 noun arrays, we expect two to be present
      component.addPosArray(0, 'nouns');
      control = ((component.contextPackForm.value.wordlists as Array<any>)[0]);
      expect(control.nouns.length).toBeGreaterThan(2);
    });
  });
  describe('Add verbs', () =>{
    it('should add an array of verbs when prompted', () =>{

      component.addWordlist();
      component.addPosArray(0, 'verbs');
      let control = ((component.contextPackForm.value.wordlists as Array<any>)[0]);
      expect(control.verbs.length).toBeGreaterThan(1);
      // Add 2 noun arrays, we expect two to be present
      component.addPosArray(0, 'verbs');
      control = ((component.contextPackForm.value.wordlists as Array<any>)[0]);
      expect(control.verbs.length).toBeGreaterThan(2);
    });
  });

  describe('Add forms', () =>{
    it('should add a form to the forms array when prompted', () =>{

      component.addWordlist();
      component.addPosArray(0, 'verbs');
      component.addForms(0, 0, 'verbs');
      const control = ((component.contextPackForm.value.wordlists as Array<any>)[0]);
      console.log(control.verbs[0].forms);
      expect(control.verbs[0].forms.length).toBeGreaterThan(1);
    });
  });
});
