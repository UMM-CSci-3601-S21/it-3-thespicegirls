import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/user.service';
import { ContextPack, Word, Wordlist} from '../contextpack';
import { ContextPackService } from '../contextpack.service';


@Component({
  selector: 'app-contextpack-card',
  templateUrl: './contextpack-card.component.html',
  styleUrls: ['./contextpack-card.component.scss']
})
export class ContextPackCardComponent implements OnInit {

  @Input() contextpack: ContextPack;
  @Input() simple ? = false;
  @Output() valueChangeEvents: EventEmitter<string[]>;

  selected = 'true';
  wordlistSelected = 'true';
  contextPackForm: FormGroup;
  editing = false;
  removable = false;
  enabled = 'true';
  isAdmin: boolean;
  deleteClicked: boolean;
  deleteIndex=0;
  userId: string;

  validationMessages = {
    word: [
    {type: 'required', message: 'One word is required'},
    ],
    wordlist: {type: 'required', message: 'Choose a Word List'}
  };

  constructor(private userService: UserService, private fb: FormBuilder,
    public snackBar: MatSnackBar, public contextpackservice: ContextPackService)
  {this.valueChangeEvents = new EventEmitter();}

  ngOnInit(): void {
    this.contextPackForm = this.fb.group({
      word: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      forms: new FormControl('', Validators.compose([

      ])),
      wordlist: new FormControl('', Validators.compose([
        Validators.required,
      ]))
    });
    this.isAdmin = this.userService.checkIfAdmin(localStorage.getItem('admin'));
    this.userId = localStorage.getItem('userId');
  }

  displayEnabled(status: boolean){
    if(!status){
      return 'Disabled';
    }
    if(status){
      return 'Enabled';
    }
  }

  toggleDeleted(index: number){
    this.deleteClicked = !this.deleteClicked;
    this.deleteIndex = index;
  }

  save(field: string, newData: string) {
		this.valueChangeEvents.emit( [newData, field] );
    if(newData === 'true'){
    this.contextpack.enabled = true;
  }
  if(newData === 'false'){
    this.contextpack.enabled = false;
  }
	}

  saveWordlist(list: Wordlist, field: string, newData: string){
    this.valueChangeEvents.emit( [list.name, newData, field ]);
  }

  submitForm(wordType: string) {
    const word = this.contextPackForm.controls.word.value + ',' + this.contextPackForm.controls.forms.value;
    const wordlist = this.contextPackForm.controls.wordlist.value;
    this.addWord(wordlist,word,wordType);
    this.contextPackForm.reset();
  }

  deleteWord(list: Wordlist, word: string, wordType: string) {
    const obj: any = this.createParamObj(wordType, word);
          this.contextpackservice.deleteWord(this.contextpack, list.name, obj).subscribe(existingID => {
            this.snackBar.open('Deleted ' + word + ' from Word list: ' + list.name, null, {
            duration: 3000,
          });
          if(wordType !== `misc`){(wordType += `s`);}
          this.localDelete(wordType, word);
        }, err => {
          this.snackBar.open('Failed to delete ' + word + ' from Word list: ' + list.name, 'OK', {
            duration: 5000,
          });
        });
  }

  deleteWordlist(list: Wordlist) {
          this.contextpackservice.deleteWordlist(this.contextpack, list.name).subscribe(existingID => {
            this.snackBar.open('Deleted ' + list.name + ' from Context Pack: ' + this.contextpack.name, null, {
            duration: 3000,
          });
            // delete wordlist locally
          let i=0;
          for(i=0; i<this.contextpack.wordlists.length; i++){
              if (this.contextpack.wordlists[i].name === list.name){
                this.contextpack.wordlists.splice(i,1);
              }
          }
          this.toggleDeleted(0);
        }, err => {
          this.snackBar.open('Failed to delete ' + list.name + ' from Word list: ' + this.contextpack.name, 'OK', {
            duration: 5000,
          });
        });
  }
  addWordlist(listname: string) {
    this.contextpackservice.addWordlist(this.contextpack, listname).subscribe(existingID => {
      this.snackBar.open('Added ' + listname + ' from Context Pack: ' + this.contextpack.name, null, {
      duration: 3000,
    });
    // add wordlist locally
    this.contextpack.wordlists.push({name:listname,enabled:true,nouns:[],verbs:[],misc:[],adjectives:[]});
  }, err => {
    this.snackBar.open('Failed to add ' + listname + ' to Word list: ' + this.contextpack.name, 'OK', {
      duration: 5000,
    });
  });
}

  localDelete(wordType: string, word: string){
    for(const list of this.contextpack.wordlists){
      let index =0;
      for(const pos of list[`${wordType}`]){
        index++;
        if (pos.word === word){
          list[`${wordType}`].splice(index-1,1);
        }
      }
    }
  }


  addWord(list: string, word: string, wordType: string){
    word = word.trim();
    if(word.endsWith(', null')){
      word = word.slice(0,word.length-6);
    }
    const obj: any = this.createParamObj(wordType, word);
        this.contextpackservice.addWord(this.contextpack, list, obj).subscribe(existingID => {
          this.snackBar.open('Added ' + word + ' to Word list: ' + list, null, { duration: 3000,
        });
        if(wordType !== `misc`){(wordType += `s`);}
        this.localAdd(wordType, word,list);
      }, err => { this.snackBar.open('Failed to add ' + word + ' to Word list: ' + list, 'OK', {
          duration: 5000,
        });
      });
  }

  localAdd(wordType: string, pos: string, listname: string){
    pos =pos.trim();
    const forms = pos.split(',');
    if(forms[1]===' null'){
      forms.pop();
    }
    const addWord: Word = {word:pos.split(',')[0],forms };
    for(const list of this.contextpack.wordlists){
      if(list.name === listname){
        list[`${wordType}`].push(addWord);
      }
    }
  }


  createParamObj(wordType: string, word: string){
    let obj: any;
    switch(wordType){
      case 'noun':obj =  { noun: word };
        break;
      case 'verb':obj =  { verb: word };
        break;
      case 'misc':obj =  { misc: word };
        break;
      case 'adjective':obj =  { adjective: word };
        break;
    }
    return obj;
  }

}
