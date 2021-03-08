import { FocusMonitorDetectionMode } from '@angular/cdk/a11y';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray, FormGroupName } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Wordlist, Word } from './contextpack';
import { WordlistService } from './contextpack.service';

@Component({
  selector: 'app-add-wordlist',
  templateUrl: './add-wordlist.component.html',
  styleUrls: ['./add-wordlist.component.scss']
})
export class AddWordlistComponent implements OnInit {

  addWordlistForm: FormGroup;

  wordlist: Wordlist;
  word: Word;

    // not sure if this topic is magical and making it be found or if I'm missing something,
  // but this is where the red text that shows up (when there is invalid input) comes from
  addWordlistValidationMessages = {
    topic: [
      {type: 'required', message: 'Topic is required'},
      {type: 'minlength', message: 'Topic must be at least 2 characters long'},
      {type: 'maxlength', message: 'Topic cannot be more than 50 characters long'},
      {type: 'existingTopic', message: 'Topic has already been taken'}
    ],

    enabled: [
      {type: 'required', message: 'Enabled is required'},
      {type: 'pattern', message: 'Enabled must be true or false'}
    ],

    nouns: [
      {type: 'pattern', message: 'Nouns must be in wordlist format'},
    ],
    verbs: [
      {type: 'pattern', message: 'Verbs must be in wordlist format'},
    ],
    adjectives: [
      {type: 'pattern', message: 'Adjectives must be in wordlist format'},
    ],
    word: [
      {type: 'required', message: 'Topic is required'},
      {type: 'minlength', message: 'Topic must be at least 2 characters long'}
    ],
    misc: [
      {type: 'pattern', message: 'Misc words must be in wordlist format'},
    ]
  };

  constructor(private fb: FormBuilder, private wordlistService: WordlistService, private snackBar: MatSnackBar, private router: Router) {
  }

  createForms() {

    // add wordlist form validations
    this.addWordlistForm = this.fb.group({
      // We allow alphanumeric input and limit the length for topic.
      topic: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        // In the real world you'd want to be very careful about having
        // an upper limit like this because people can sometimes have
        // very long names. This demonstrates that it's possible, though,
        // to have maximum length limits.
        Validators.maxLength(50),
      ])),

      // Since this is for a company, we need workers to be old enough to work, and probably not older than 200.
      enabled: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^(true|false)$')
      ])),

      nouns: this.fb.array([]),

      verbs: new FormControl([], Validators.compose([

        Validators.pattern('^(Word)$'),
      ])),
      adjectives: new FormControl([], Validators.compose([

        Validators.pattern('^(Word)$'),
      ])),
      misc: new FormControl([], Validators.compose([

        Validators.pattern('^(Word)$'),
      ])),

    });
  }

  newNoun(): FormGroup{
    return this.fb.group({
      word: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ])),
      forms: this.fb.array([this.fb.control('')])
    });
  }

  addNoun(){
    this.nouns().push(this.newNoun());
  }
  removeNouns(empIndex: number){
    this.nouns().removeAt(empIndex);
  }
  forms(empIndex: number): FormArray{
    return this.nouns().at(empIndex).get('forms') as FormArray;
  }
  addForm(empIndex: number){
    this.forms(empIndex).push(this.fb.control(''));
  }
  removeForm(empIndex: number, skillIndex: number){
    this.forms(empIndex).removeAt(skillIndex);
  }

  nouns(): FormArray {
    return this.addWordlistForm.get('nouns') as FormArray;
  }

  ngOnInit() {
    this.createForms();
  }

  onSubmit() {
    this.wordlistService.addWordlist(this.addWordlistForm.value).subscribe(newID => {
      this.snackBar.open('Added Wordlist ' + this.addWordlistForm.value.topic, null, {
        duration: 2000,
      });
      this.router.navigate(['/wordlists/', newID]);
    }, err => {
      this.snackBar.open('Failed to add the wordlist', 'OK', {
        duration: 5000,
      });
    });
  }

  submitForm() {
    this.wordlistService.addWordlist(this.addWordlistForm.value).subscribe(newID => {
      this.snackBar.open('Added Wordlist ' + this.addWordlistForm.value.topic, null, {
        duration: 2000,
      });
      this.router.navigate(['/wordlists/', newID]);
    }, err => {
      this.snackBar.open('Failed to add the wordlist', 'OK', {
        duration: 5000,
      });
    });
  }

}
