import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContextPack, Wordlist} from './contextpack';
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

  submitForm(wordType: string) {
    const word = this.contextPackForm.controls.word.value + ', ' + this.contextPackForm.controls.forms.value;
    const wordlist = this.contextPackForm.controls.wordlist.value;
    this.addWord(wordlist,word,wordType); //addWord already reloads the page
  }

  reload(){
    window.location.reload();
  }

  deleteWord(list: Wordlist, word: string, wordType: string) {
    const obj: any = this.createParamObj(wordType, word);
          this.contextpackservice.deleteWord(this.contextpack, list.name, obj).subscribe(existingID => {
            this.snackBar.open('Deleted ' + word + ' from Word list: ' + list.name, null, {
            duration: 2000,
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
    const obj: any = this.createParamObj(wordType, word);
        this.contextpackservice.addWord(this.contextpack, list, obj).subscribe(existingID => {
          this.snackBar.open('Added ' + word + ' to Word list: ' + list, null, {
          duration: 2000,
        });
        this.reload();
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
    let obj: any;
    switch(field){
      case 'name':obj =  { name: newData };
        break;
      case 'enabled':obj =  { enabled: newData };
        break;
    }
    this.contextpackservice.updateWordList(this.contextpack, list.name, obj).subscribe(existingID => {
      this.snackBar.open('Updated enabled status of Word list: ' + list.name, null, {
      duration: 2000,
    });
    this.reload();
    }, err => {
      this.snackBar.open('Failed to update enabled status of Word list: ' + list.name, 'OK', {
        duration: 5000,
        });
      });
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
