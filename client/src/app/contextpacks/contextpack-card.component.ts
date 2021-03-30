import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContextPack, Wordlist, WordRole } from './contextpack';
import { ContextPackService } from './contextpack.service';
import {MatChipsModule} from '@angular/material/chips';




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
  contextPackForm: FormGroup;
  editing = false;

  constructor(private snackBar: MatSnackBar, private contextpackservice: ContextPackService)
  {this.valueChangeEvents = new EventEmitter();}

  ngOnInit(): void {}

  public save(field: string, newData: string): void {

		this.valueChangeEvents.emit( [newData, field] );

	}

  deleteWord(list: Wordlist, word: string, wordType: string): void {

      switch(wordType){
        case 'noun' :
          this.contextpackservice.updateWordList(this.contextpack, list.name, null, null, { noun: word }).subscribe(existingID => {
            this.snackBar.open('Deleted ' + word + ' from Word list: ' + list.name, null, {
            duration: 2000,
          });
        }, err => {
          this.snackBar.open('Failed to delete ' + word + ' from Word list: ' + list.name, 'OK', {
            duration: 5000,
          });
        });
          break;
        case 'verb':
          this.contextpackservice.updateWordList(this.contextpack, list.name, null, null, { verb: word }).subscribe(existingID => {
            this.snackBar.open('Deleted ' + word + ' from Word list: ' + list.name, null, {
            duration: 2000,
          });
        }, err => {
          this.snackBar.open('Failed to delete ' + word + ' from Word list: ' + list.name, 'OK', {
            duration: 5000,
          });
        });
          break;
        case 'adjective' :
          this.contextpackservice.updateWordList(this.contextpack, list.name, null, null, { adjective: word }).subscribe(existingID => {
            this.snackBar.open('Deleted ' + word + ' from Word list: ' + list.name, null, {
            duration: 2000,
          });
        }, err => {
          this.snackBar.open('Failed to delete ' + word + ' from Word list: ' + list.name, 'OK', {
            duration: 5000,
          });
        });
          break;
        case 'misc' :
          this.contextpackservice.updateWordList(this.contextpack, list.name, null, null, { misc: word }).subscribe(existingID => {
            this.snackBar.open('Deleted ' + word + ' from Word list: ' + list.name, null, {
            duration: 2000,
          });
        }, err => {
          this.snackBar.open('Failed to delete ' + word + ' from Word list: ' + list.name, 'OK', {
            duration: 5000,
          });
        });
          break;
      }
    }

  addWord(list: Wordlist, word: string, wordType: string){

    switch(wordType){
      case 'noun' :
        this.contextpackservice.updateWordList(this.contextpack, list.name, null, { noun: word }, null).subscribe(existingID => {
          this.snackBar.open('Added ' + word + ' to Word list: ' + list.name, null, {
          duration: 2000,
        });
      }, err => {
        this.snackBar.open('Failed to add ' + word + ' to Word list: ' + list.name, 'OK', {
          duration: 5000,
        });
      });
        break;
      case 'verb':
        this.contextpackservice.updateWordList(this.contextpack, list.name, null, { verb: word }, null).subscribe(existingID => {
          this.snackBar.open('Added ' + word + ' to Word list: ' + list.name, null, {
          duration: 2000,
        });
      }, err => {
        this.snackBar.open('Failed to add ' + word + ' to Word list: ' + list.name, 'OK', {
          duration: 5000,
        });
      });
        break;
      case 'adjective' :
        this.contextpackservice.updateWordList(this.contextpack, list.name, null, { adjective: word }, null).subscribe(existingID => {
          this.snackBar.open('Added ' + word + ' to Word list: ' + list.name, null, {
          duration: 2000,
        });
      }, err => {
        this.snackBar.open('Failed to add ' + word + ' to Word list: ' + list.name, 'OK', {
          duration: 5000,
        });
      });
        break;
      case 'misc' :
        this.contextpackservice.updateWordList(this.contextpack, list.name, null, { misc: word }, null).subscribe(existingID => {
          this.snackBar.open('Added ' + word + ' to Word list: ' + list.name, null, {
          duration: 2000,
        });
      }, err => {
        this.snackBar.open('Failed to add ' + word + ' to Word list: ' + list.name, 'OK', {
          duration: 5000,
        });
      });
        break;
    }
  }

  editField(list: Wordlist, newData: string, field: string){

    switch(field) {
      case 'name' :
        this.contextpackservice.updateWordList(this.contextpack, list.name, { name: newData }, null , null).subscribe(existingID => {
          this.snackBar.open('Updated name of Word list: ' + list.name + ' to: ' + newData, null, {
          duration: 2000,
        });
      }, err => {
        this.snackBar.open('Failed to update name of list: ' + list.name, 'OK', {
          duration: 5000,
        });
      });
        break;
      case 'enabled' :
        this.contextpackservice.updateWordList(this.contextpack, list.name, { enabled: newData }, null, null).subscribe(existingID => {
          this.snackBar.open('Updated enabled status of Word list: ' + list.name, null, {
          duration: 2000,
        });
      }, err => {
        this.snackBar.open('Failed to update enabled status of Word list: ' + list.name, 'OK', {
          duration: 5000,
        });
      });
    }
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
