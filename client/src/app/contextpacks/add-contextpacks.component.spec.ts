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
        RouterTestingModule,
        MatCardModule
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
  });
  describe('Add wordlist', () =>{
    it('should add a wordlist when prompted', () =>{
      component.addWordlist();
      let formValue = component.contextPackForm.value;
      expect(formValue.wordlists.length).toEqual(1);
      component.addWordlist();
      formValue = component.contextPackForm.value;
      expect(formValue.wordlists.length).toEqual(2);
    });
  });
  describe('Add nouns', () =>{
    it('should add an array of nouns when prompted', () =>{

      component.addWordlist();
      component.addPosArray(0, 'nouns');
      let control = ((component.contextPackForm.value.wordlists as Array<any>)[0]);
      console.log(control.nouns);
      expect(control.nouns.length).toEqual(1);
      // Add 2 noun arrays, we expect two to be present
      component.addPosArray(0, 'nouns');
      control = ((component.contextPackForm.value.wordlists as Array<any>)[0]);
      expect(control.nouns.length).toEqual(2);
    });
  });
  describe('Add verbs', () =>{
    it('should add an array of verbs when prompted', () =>{

      component.addWordlist();
      component.addPosArray(0, 'verbs');
      let control = ((component.contextPackForm.value.wordlists as Array<any>)[0]);
      expect(control.verbs.length).toEqual(1);
      // Add 2 noun arrays, we expect two to be present
      component.addPosArray(0, 'verbs');
      control = ((component.contextPackForm.value.wordlists as Array<any>)[0]);
      expect(control.verbs.length).toEqual(2);
    });
  });

  describe('Add forms', () =>{
    it('should add a form to the forms array when prompted', () =>{

      component.addWordlist();
      component.addPosArray(0, 'verbs');
      component.addForms(0, 0, 'verbs');
      const control = ((component.contextPackForm.value.wordlists as Array<any>)[0]);
      expect(control.verbs[0].forms.length).toEqual(2);
    });
  });

  describe('Removing components of a context pack during creation', ()=>{
    it('should remove a form to the forms array when prompted', () =>{
      // Add components so they can be removes
      component.addWordlist();
      component.addPosArray(0, 'verbs');
      component.addPosArray(0, 'verbs');
      component.addForms(0, 0, 'verbs');
      // make sure components were added
      let controls = ((component.contextPackForm.value.wordlists as Array<any>)[0]);
      expect(controls.verbs[0].forms.length).toEqual(2);
      // remove a form
      component.removeForm(0, 0, 0,'verbs');
      controls = ((component.contextPackForm.value.wordlists as Array<any>)[0]);
      expect(controls.verbs[0].forms.length).toEqual(1);
      //remove verb word group
      expect(controls.verbs.length).toEqual(2);
      component.removeWord(0, 0, 'verbs');
      controls = ((component.contextPackForm.value.wordlists as Array<any>)[0]);
      console.log(controls.verbs[0]);
      expect(controls.verbs.length).toEqual(1);
      // remove wordlist
      component.addWordlist();
      controls = ((component.contextPackForm.value.wordlists as Array<any>));
      expect(controls.length).toEqual(2);
      component.removeWordlists(1);
      controls = ((component.contextPackForm.value.wordlists as Array<any>));
      expect(controls.length).toEqual(1);
    });

  });

  describe('Set word feature', ()=>{
    it('should set the first form to the same word', ()=>{
      component.addWordlist();
      component.addPosArray(0, 'verbs');
      component.addForms(0 ,0 , 'verbs');

      (((component.contextPackForm.controls.wordlists as FormArray).at(0).get(`verbs`) as FormArray).at(0)
    .get('forms') as FormArray).at(0).setValue('cow');

      component.setWord(0,0,'verbs');
      // expect cow to be the first form
      expect(((component.contextPackForm.controls.wordlists as FormArray).at(0).get(`verbs`) as FormArray).at(0)
      .get('word').value).toEqual('cow');
    });
  });
  describe('form submission', ()=>{
    it('form should validate based on input', ()=>{
      component.addWordlist();
      expect(component.contextPackForm.valid).toBeFalsy();
      ((component.contextPackForm).get(`name`).setValue('cow'));
      ((component.contextPackForm).get(`enabled`).setValue('true'));
      ((component.contextPackForm.controls.wordlists as FormArray).at(0).get(`name`).setValue('cow'));
      ((component.contextPackForm.controls.wordlists as FormArray).at(0).get(`enabled`).setValue('true'));
      expect(component.contextPackForm.valid).toBeTruthy();
    });
  });
  describe('Toggle Button', ()=>{
    it('should toggle the boolean status', ()=>{
      expect(component.toggleShow()).toBeTruthy();
    });
  });
});
