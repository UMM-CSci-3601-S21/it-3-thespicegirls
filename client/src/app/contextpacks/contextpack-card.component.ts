import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContextPack, Wordlist, WordRole } from './contextpack';
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
  contextPackForm: FormGroup;
  editing = false;
  list: Wordlist;
  delnoun: string;



  constructor(private snackBar: MatSnackBar, private contextpackservice: ContextPackService)
  {this.valueChangeEvents = new EventEmitter();}

  ngOnInit(): void
  {
  }


  public save(field: string, newData: string): void {

		this.valueChangeEvents.emit( [newData, field] );

	}
  setParams(list: Wordlist, delnoun: string){
    this.list = list;
    this.delnoun=delnoun;
  }
  deleteWord2(){
    console.log('deleting');
    console.log(this.list);
    //to figure out what field is being changed so the correct http param can be sent
      this.contextpackservice.deleteWord(this.contextpack, this.list.name, {delnoun:this.delnoun}).subscribe(existingID => {
        this.snackBar.open('Updated field ' + this.delnoun + ' of pack ' + this.list.name, null, {
        duration: 2000,
      });
    }, err => {
      this.snackBar.open('Failed to update the ' + this.delnoun + ' field with value ' + this.delnoun, 'OK', {
        duration: 5000,
      });
    });

  }


    deleteWord(list: Wordlist, word: string): void {
      console.log('deleting');
      console.log(list.name);
      //to figure out what field is being changed so the correct http param can be sent
        this.contextpackservice.deleteWord(this.contextpack, list.name, {delnoun:word}).subscribe(existingID => {
          this.snackBar.open('Updated field ' + word + ' of pack ' + list.name, null, {
          duration: 2000,
        });
      }, err => {
        this.snackBar.open('Failed to update the ' + word + ' field with value ' + list.name, 'OK', {
          duration: 5000,
        });
      });

    }


  displayWordlists(contextpack: Wordlist){
    let  wordlists: string;
      wordlists = '';
        wordlists += 'Word List ' + 'Name: ' + contextpack.name + '\n';
        wordlists += 'Enabled: ' + contextpack.enabled + '\n';
        wordlists += 'Nouns: \n' + this.displayWords(contextpack, 'nouns');
        wordlists += 'Verbs: \n' + this.displayWords(contextpack, 'verbs');
        wordlists += 'Adjectives: \n' + this.displayWords(contextpack, 'adjectives');
        wordlists += 'Misc: \n' + this.displayWords(contextpack, 'misc');
    return wordlists;
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

  displayAllWords(contextpack: ContextPack, pos: WordRole){
      let words: Wordlist[];
      let m: number;
      let str: string;
      if(contextpack.wordlists === undefined || contextpack.wordlists[0][`${pos}`][0] === undefined){
        words = null;
        str = null;
      }
      else{
        words = [];
      for (m = 0; m < contextpack.wordlists.length; m++){
          words = words.concat(contextpack.wordlists[m]);
        }

      let z: number;
      str = '\n';
      for (z = 0; z < words.length; z++){
        str += this.displayWords(words[z], pos);
        str = str.slice(0, -1);
        if (z < words.length-1 && !(words[z+1][`${pos}`][0]===undefined)){
          str += ', ';
          }
        }
      }
      return str;
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
        words.push( ' '+ lists[j][`${pos}`][i].word);
      }
    }
    return words;
}

}
