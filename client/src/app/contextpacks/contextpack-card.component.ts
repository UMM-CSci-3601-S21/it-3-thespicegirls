import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContextPack, Word, Wordlist, WordRole } from './contextpack';
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


  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private contextpackservice: ContextPackService)
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
  }


  displayEnabled(status: boolean){
    if(status === false){
      return 'Disabled';
    }
    if(status === true){
      return 'Enabled';
    }
  }

  save(field: string, newData: string): void {
		this.valueChangeEvents.emit( [newData, field] );
	}

  submitForm(wordType: string){
    const word = this.contextPackForm.controls.word.value + ', ' + this.contextPackForm.controls.forms.value;
    const wordlist = this.contextPackForm.controls.wordlist.value;
    this.addWord(wordlist,word,wordType);
    this.ngOnInit();
  }

  deleteWord(list: Wordlist, word: string, wordType: string): string {
    const obj: any = this.createParamObj(wordType, word);
          this.contextpackservice.updateWordList(this.contextpack, list.name, null, null, obj).subscribe(existingID => {
            this.snackBar.open('Deleted ' + word + ' from Word list: ' + list.name, null, {
            duration: 2000,
          });
        }, err => {
          this.snackBar.open('Failed to delete ' + word + ' from Word list: ' + list.name, 'OK', {
            duration: 5000,
          });
          return 'failed';
        });
        return word;
    }

  addWord(list: string, word: string, wordType: string){
    const obj: any = this.createParamObj(wordType, word);
        this.contextpackservice.updateWordList(this.contextpack, list, null, obj, null).subscribe(existingID => {
          this.snackBar.open('Added ' + word + ' to Word list: ' + list, null, {
          duration: 2000,
        });
      }, err => {
        this.snackBar.open('Failed to add ' + word + ' to Word list: ' + list, 'OK', {
          duration: 5000,
        });
      });
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

  editField(list: Wordlist, newData: string, field: string){
    const obj = this.createParamObj(field, newData);
    this.contextpackservice.updateWordList(this.contextpack, list.name, obj, null, null).subscribe(existingID => {
        this.snackBar.open('Updated enabled status of Word list: ' + list.name, null, {
        duration: 2000,
        });
    }, err => {
      this.snackBar.open('Failed to update enabled status of Word list: ' + list.name, 'OK', {
        duration: 5000,
        });
      });

  }

  displayWords(wordlist: Wordlist, pos: WordRole){
    let words: string[];
    if (wordlist[`${pos}`] === undefined){
      words = null;
    }
    else{
      let i: number;
      words = [];
        for (i = 0; i < wordlist[`${pos}`].length; i++) {
          words = words.concat(wordlist[`${pos}`][i].word );
        }
    }
    return words;
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

  displayWordsNoForms(contextpack: ContextPack, pos: WordRole){
    let lists: Wordlist[];
    let m: number;
    if(contextpack.wordlists === undefined ){
      lists = null;
    }
    else{
      lists = [];
    for (m = 0; m < contextpack.wordlists.length; m++){
      lists = lists.concat(contextpack.wordlists[m]);
      }
    }
    const words: string[] =[];
    let j=0;
    let i=0;

    for( j=0; j<lists.length; j++){
      for( i=0;i<lists[j][`${pos}`].length; i++){
        words.push(lists[j][`${pos}`][i].word);
      }
    }
    return words;
}

}
