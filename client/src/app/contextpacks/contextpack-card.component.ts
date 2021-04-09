import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContextPack, Word, Wordlist} from './contextpack';
import { ContextPackService } from './contextpack.service';


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

  validationMessages = {
    word: [
    {type: 'required', message: 'One word is required'},
    ],
    wordlist: {type: 'required', message: 'Choose a Word List'}
  };

  constructor(private fb: FormBuilder, public snackBar: MatSnackBar, private contextpackservice: ContextPackService)
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
    this.isAdmin = this.contextpackservice.checkIfAdmin(localStorage.getItem('admin'));
  }

  displayEnabled(status: boolean){
    if(status === false){
      return 'Disabled';
    }
    if(status === true){
      return 'Enabled';
    }
  }

  save(field: string, newData: string) {
		this.valueChangeEvents.emit( [newData, field] );
	}

  saveWordlist(list: Wordlist, field: string, newData: string){
    this.valueChangeEvents.emit( [list.name, newData, field ]);
  }

  submitForm(wordType: string) {
    const word = this.contextPackForm.controls.word.value + ', ' + this.contextPackForm.controls.forms.value;
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


  downloadJson(myJson: ContextPack, topic: string){
      myJson = this.convertToBetterJson(myJson);
      const sJson = JSON.stringify(myJson, null, 2);
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/json;charset=UTF-8,' + encodeURIComponent(sJson));
      element.setAttribute('download', topic + '.json');
      element.style.display = 'none';
      document.body.appendChild(element);
      document.body.removeChild(element);
      return element;
}

  convertToBetterJson(jsonBetter: ContextPack){
    const obj: any =
      {
      $schema: 'https://raw.githubusercontent.com/kidstech/story-builder/master/Assets/packs/schema/pack.schema.json',
      name: jsonBetter.name,
      icon: jsonBetter.icon,
      enabled: jsonBetter.enabled,
      wordlists: jsonBetter.wordlists
      };
      return obj;
  }

}
