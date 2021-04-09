/* eslint-disable guard-for-in */
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContextPackService } from './contextpack.service';
import { Router } from '@angular/router';
import { ContextPackCardComponent } from './contextpack-card.component';

@Component({
  selector: 'app-add-contextpacks',
  templateUrl: './add-contextpacks.component.html',
  styleUrls: ['./add-contextpacks.component.scss']
})
export class AddContextpacksComponent implements OnInit {
  contextPackForm: FormGroup;
  isShown = false;
  contextpackcard = new ContextPackCardComponent(this.fb,this.snackBar,this.contextPackService);
  tabs = [];
  activeTab = this.tabs[0];
  selected = new FormControl(0);
  panelOpenState= false;


  formErrors = {
    wordlists: this.wordlistsErrors()
  };

  validationMessages = {
    wordlists: {
      name: [
        {type: 'required', message: 'Name is required'},
      ],
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
  isSignedIn: boolean;

  constructor(private fb: FormBuilder, private contextPackService: ContextPackService,
    private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit() {
    this.contextPackForm = this.fb.group({
      name: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      enabled: true,
      icon: '',
      wordlists: this.fb.array([])
    });
    this.contextPackForm.valueChanges.subscribe(data => this.validateForm());
    this.isSignedIn = this.contextPackService.checkIfLoggedIn(localStorage.getItem('loggedIn'));

  }

  initwordlist() {
    return this.fb.group({
      //  ---------------------forms fields on x level ------------------------
      name: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      enabled: true,
      // ---------------------------------------------------------------------
      nouns: this.fb.array([]),
      adjectives: this.fb.array([]),
      verbs: this.fb.array([]),
      misc: this.fb.array([])

    });
  }

  initNouns() {
    return this.fb.group({
      //  ---------------------forms fields on y level ------------------------
      word: '',
      // ---------------------------------------------------------------------
      forms: this.fb.array([
        this.fb.control('')
      ])
    });
  }

  addWordlist() {
    const control = this.contextPackForm.controls.wordlists as FormArray;
    control.push(this.initwordlist());
    //Add tab
    this.tabs.push('Wordlist');
    this.selected.setValue(this.tabs.length - 1);
  }
  addPosArray(ix: number, pos: string){
    const control = (this.contextPackForm.controls.wordlists as FormArray).at(ix).get(`${pos}`) as FormArray;
    control.push(this.initNouns());
  }
  addForms(ix: number, iy: number, pos: string) {
    const control = ((this.contextPackForm.controls.wordlists as FormArray).at(ix).get(`${pos}`) as FormArray)
    .at(iy).get('forms') as FormArray;
    control.push(this.fb.control(''));
  }
  setWord(ix: number, iy: number, pos: string){
    const control = (((this.contextPackForm.controls.wordlists as FormArray).at(ix).get(`${pos}`) as FormArray).at(iy)
    .get('word'));

    const formAdd = (((this.contextPackForm.controls.wordlists as FormArray).at(ix).get(`${pos}`) as FormArray).at(iy)
    .get('forms') as FormArray).at(0).value.toString();
    console.log('didnt go through');
      control.setValue(formAdd);
      console.log(ix,iy);
  }

  toggleEnabled(){
    console.log('button is being checked');
    this.contextPackForm.controls.enabled.setValue(!this.contextPackForm.controls.enabled);
  }


  removeWordlists(empIndex: number){
    (this.contextPackForm.controls.wordlists as FormArray).removeAt(empIndex);
    //Remove tab
    this.tabs.splice(empIndex, 1);
  }

  removeWord(ix: number, iy: number, pos: string){
    ((this.contextPackForm.controls.wordlists as FormArray).at(ix).get(`${pos}`) as FormArray).removeAt(iy);
  }

  removeForm(ix: number, iy: number, iz: number,  pos: string){
    (((this.contextPackForm.controls.wordlists as FormArray).at(ix).get(`${pos}`) as FormArray)
    .at(iy).get('forms') as FormArray).removeAt(iz);
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
      x++;
    }
  }


toggleShow() {
this.isShown = ! this.isShown;
return this.isShown;
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
