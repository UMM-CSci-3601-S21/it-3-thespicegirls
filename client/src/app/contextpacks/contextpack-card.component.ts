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
    let nounWords: string[];
    let str: string;
    if (wordlist[`${pos}`] === undefined){
      nounWords = null;
      str = null;
    }
    else{
      let i: number;
      nounWords = [];
        for (i = 0; i < wordlist[`${pos}`].length; i++) {
          nounWords = nounWords.concat(wordlist[`${pos}`][i].forms) ;
        }
        str = nounWords.join(', ');
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
      enabled: jsonBetter.enabled,
      wordlists: jsonBetter
      };
      return obj;
  }

  displayAllWords(contextpack: ContextPack, pos: WordRole){
      let nounsWords: Wordlist[];
      let m: number;
      let str: string;
      if (contextpack.wordlists === undefined || contextpack.wordlists[0][`${pos}`] === undefined){
        nounsWords = null;
        str = null;
      }
      else{
        nounsWords = [];
      for (m = 0; m < contextpack.wordlists.length; m++){
          nounsWords = nounsWords.concat(contextpack.wordlists[m]);
        }

      let z: number;
      str = '\n';
      for(z = 0; z < nounsWords.length; z++){
        str += this.displayWords(nounsWords[z], pos);
        str = str.slice(0, -1);
            }
          }
      return str;
  }
}
