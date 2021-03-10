/* eslint-disable guard-for-in */
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContextPackService } from './contextpack.service';
import { Router } from '@angular/router';

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
        required: 'Name is required.',

      },
      enabled: {
        required: 'Must be true or false (check capitalization)',
      },
      nouns: {
        word: {
        },
        forms: {
        },
      },
      adjectives: {
        word: {
        },
        forms: {
        },
      },
      verbs: {
        word: {
        },
        forms: {
        },
      },
      misc: {
        word: {
        },
        forms: {
        },
      }
    }
  };

  constructor(private fb: FormBuilder, private contextPackService: ContextPackService,
    private snackBar: MatSnackBar, private router: Router) { }




  ngOnInit() {
    this.contextPackForm = this.fb.group({
      name: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      enabled: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^(true|false)'),
      ])),
      icon: '',
      wordlists: this.fb.array([
        this.initwordlist()
      ])
    });
    this.contextPackForm.valueChanges.subscribe(data => this.validateForm());
  }

  initwordlist() {
    return this.fb.group({
      //  ---------------------forms fields on x level ------------------------
      name: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      enabled: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^(true|false)$'),
      ])),
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
      name: [' ', [Validators.required]],
      enabled:[' ', [Validators.required]],

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
    this.validateWordlists();
  }
  validateWordlists() {
    const wordlistsA = this.contextPackForm.controls.wordlists as FormArray;
    // console.log(XsA.value);
    this.formErrors.wordlists = [];
    let x = 1;
    while (x <= wordlistsA.length) {
      this.formErrors.wordlists.push({
        name: [' ', [Validators.required]],
        enabled: [' ', [Validators.required]],
        nouns: [{
          word: '',
          forms: this.fb.array([
            this.fb.control('')
          ]),
        }]
      });
      const wordlist = wordlistsA.at(x - 1 ) as FormGroup;
      for (const field in wordlist.controls) {
        const input = wordlist.get(field);
        if (input.invalid && input.dirty) {
          for (const error in input.errors) {
            this.formErrors.wordlists[x - 1][field] = this.validationMessages.wordlists[field][error];
          }
        }
      }
      x++;
    }

  }

  submitForm() {
    this.contextPackService.addContextPack(this.contextPackForm.value).subscribe(newID => {
      this.snackBar.open('Added Pack ' + this.contextPackForm.value.name, null, {
        duration: 2000,
      });
      this.router.navigate(['/contextpacks/', newID]);
    }, err => {
      this.snackBar.open('Failed to add the pack', 'OK', {
        duration: 5000,
      });
    });
  }





}
