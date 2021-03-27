import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ContextPack, Wordlist, WordRole } from './contextpack';
import { ContextPackService } from './contextpack.service';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-contextpack-card',
  templateUrl: './contextpack-card.component.html',
  styleUrls: ['./contextpack-card.component.scss']
})
export class ContextPackCardComponent implements OnInit {

  @Input() contextpack: ContextPack;
  @Input() simple ? = false;
  @Output() valueChangeEvents: EventEmitter<any>;

  selected = 'true';
  contextPackForm: FormGroup;
  editing = false;

  constructor( private contextPackService: ContextPackService )
   {this.valueChangeEvents = new EventEmitter();}

  ngOnInit(): void {
  }


  public save(field: string, newData: string): void {

		this.valueChangeEvents.emit( [newData, field] );

	}
  deleteWord(list: Wordlist, delnoun: string) {
    console.log('deleting');
    console.log(list.name);
    console.log(delnoun);

    }
  // deleteWord(){
  //   console.log('deleting');
  //   console.log(this.delnoun);
  //   this.contextPackService.deleteWord(
  //     this.contextpack,
  //     {delverb: this.delverb, listname: this.listname,
  //     delnoun:this.delnoun}
  //   );
  // }

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
