import { Component, OnInit, Input } from '@angular/core';
import { ContextPack, Wordlist, WordRole } from './contextpack';


@Component({
  selector: 'app-contextpack-card',
  templateUrl: './contextpack-card.component.html',
  styleUrls: ['./contextpack-card.component.scss']
})
export class ContextPackCardComponent implements OnInit {

  @Input() contextpack: ContextPack;
  @Input() simple ? = false;
  @Input() edit ? = false;
  selected = 'true';

  constructor() { }

  ngOnInit(): void {
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
    let str: string;
    if (wordlist[`${pos}`] === undefined){
      words = null;
      str = null;
    }
    else{
      let i: number;
      words = [];
        for (i = 0; i < wordlist[`${pos}`].length; i++) {
          words = words.concat(wordlist[`${pos}`][i].forms) ;
        }
        str = words.join(', ');
        str += '\n';
    }

    return str;
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
}
