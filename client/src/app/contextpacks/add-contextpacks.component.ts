/* eslint-disable guard-for-in */
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ContextPackService } from './contextpack.service';

@Component({
  selector: 'app-add-contextpacks',
  templateUrl: './add-contextpacks.component.html',
  styleUrls: ['./add-contextpacks.component.scss']
})
export class AddContextpacksComponent implements OnInit {
  contextPackForm: FormGroup;

  formErrors = {
    wordlists: this.wordlistsErrors()
  };

  validationMessages = {
    wordlists: {
      name: {
        required: 'X is required.',
        pattern: 'X must be 3 characters long.'

      },
      nouns: {
        word: {
          required: 'Y1 is required.',
          pattern: 'Y1 must be 3 characters long.'
        },
        forms: {
          required: 'Y2 is required.',
          pattern: 'Y2 must be 3 characters long.'
        },
      },
      adjectives: {
        word: {
          required: 'Y1 is required.',
          pattern: 'Y1 must be 3 characters long.'
        },
        forms: {
          required: 'Y2 is required.',
          pattern: 'Y2 must be 3 characters long.'
        },
      },
      verbs: {
        word: {
          required: 'Y1 is required.',
          pattern: 'Y1 must be 3 characters long.'
        },
        forms: {
          required: 'Y2 is required.',
          pattern: 'Y2 must be 3 characters long.'
        },
      },
      misc: {
        word: {
          required: 'Y1 is required.',
          pattern: 'Y1 must be 3 characters long.'
        },
        forms: {
          required: 'Y2 is required.',
          pattern: 'Y2 must be 3 characters long.'
        },
      }
    }
  };

  constructor(private fb: FormBuilder) { }




  ngOnInit() {
    this.contextPackForm = this.fb.group({
      name: '',
      enabled: '',
      wordlists: this.fb.array([
        this.initwordlist()
      ])
    });
  }

  initwordlist() {
    return this.fb.group({
      //  ---------------------forms fields on x level ------------------------
      name: [' ', [Validators.required]],
      enabled: [' ', [Validators.required]],
      // ---------------------------------------------------------------------
      nouns: this.fb.array([
        this.initNouns()
      ]),
      adjectives: this.fb.array([
        this.initNouns()
      ]),
      verbs: this.fb.array([
        this.initNouns()
      ]),
      misc: this.fb.array([
        this.initNouns()
      ])

    });
  }

  initNouns() {
    return this.fb.group({
      //  ---------------------forms fields on y level ------------------------
      word: [''],
      // ---------------------------------------------------------------------
      forms: this.fb.array([
         this.fb.control('')
      ])
    });
  }

  addWordlist() {
    const control = this.contextPackForm.controls.wordlists as FormArray;
    control.push(this.initwordlist());
  }
  addPosArray(ix, pos){
    const control = (this.contextPackForm.controls.wordlists as FormArray).at(ix).get(`${pos}`) as FormArray;
    control.push(this.initNouns());
  }
  addForms(ix, iy, pos) {
    const control = ((this.contextPackForm.controls.wordlists as FormArray).at(ix).get(`${pos}`) as FormArray)
    .at(iy).get('forms') as FormArray;
    control.push(this.fb.control(''));
  }




  wordlistsErrors() {
    return [{
      //  ---------------------forms errors on x level ------------------------
      name: '',
      enabled: '',

      // ---------------------------------------------------------------------
      nouns: this.nounsErrors()

    }];

  }

  nounsErrors() {
    return [{
      //  ---------------------forms errors on y level ------------------------
      word: '',
      forms: this.fb.array([
        this.fb.control('')
      ]),

    }];
  }









  // form validation
  validateForm() {
    // console.log('validateForm');
    // for (let field in this.formErrors) {
    //   this.formErrors[field] = '';
    //   let input = this.register_readers.get(field);
    //   if (input.invalid && input.dirty) {
    //     for (let error in input.errors) {
    //       this.formErrors[field] = this.validationMessages[field][error];
    //     }
    //   }
    // }
    this.validateWordlists();
  }
  validateWordlists() {
    const wordlistsA = this.contextPackForm.controls.wordlists as FormArray;
    console.log('validateXs');
    // console.log(XsA.value);
    this.formErrors.wordlists = [];
    let x = 1;
    while (x <= wordlistsA.length) {
      this.formErrors.wordlists.push({
        name: '',
        enabled: '',
        nouns: [{
          word: '',
          forms: this.fb.array([
            this.fb.control('')
          ]),
        }]
      });
      const wordlist = wordlistsA.at(x - 1 ) as FormGroup;
      console.log('X--->');
      console.log(wordlist.value);
      for (const field in wordlist.controls) {
        const input = wordlist.get(field);
        console.log('field--->');
        console.log(field);
        if (input.invalid && input.dirty) {
          for (const error in input.errors) {
            this.formErrors.wordlists[x - 1][field] = this.validationMessages.wordlists[field][error];
          }
        }
      }
      this.validateYs(x);
      x++;
    }

  }

  validateYs(wordlist) {
    console.log('validateYs');
    const nounsA = (this.contextPackForm.controls.wordlists as FormArray).at(wordlist - 1).get('nouns') as FormArray;
    this.formErrors.wordlists[wordlist - 1].nouns = [];
    let y = 1;
    while (y <= nounsA.length) {
      this.formErrors.wordlists[wordlist - 1].nouns.push({
        word: '',
        forms: this.fb.array([
          this.fb.control('')
        ]),
      });
      const nouns = nounsA.at(y - 1) as FormGroup;
      for (const field in nouns.controls) {
        const input = nouns.get(field);
        if (input.invalid && input.dirty) {
          for (const error in input.errors) {
            this.formErrors.wordlists[wordlist - 1].nouns[y - 1][field] = this.validationMessages.wordlists.nouns[field][error];

          }

        }
      }
      y++;
    }
  }






  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.contextPackForm.value);
  }



}
