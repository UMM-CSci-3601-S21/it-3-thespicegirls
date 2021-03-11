import { Component, OnInit, Input } from '@angular/core';
import { ContextPack, Wordlist } from './contextpack';

@Component({
  selector: 'app-contextpack-card',
  templateUrl: './contextpack-card.component.html',
  styleUrls: ['./contextpack-card.component.scss']
})
export class ContextPackCardComponent implements OnInit {

  @Input() contextpack: ContextPack;
  @Input() simple ? = false;

  constructor() { }

  ngOnInit(): void {
  }

  displayWordlists(contextpack: ContextPack){
    let  wordlists: string;
    if(contextpack.wordlists === undefined){
      wordlists = null;
    }
    else{
      wordlists = '';
      let i: number;
      for(i = 0; i < contextpack.wordlists.length; i++){
        wordlists += 'Word List ' + (i+1)+ ' Name: ' + contextpack.wordlists[i].name + '\n';
        wordlists += 'Enabled: ' + contextpack.wordlists[i].enabled + '\n';
        wordlists += 'Nouns: \n' + this.displayNouns(contextpack.wordlists[i]);
        wordlists += 'Verbs: \n' + this.displayVerbs(contextpack.wordlists[i]);
        wordlists += 'Adjectives: \n' + this.displayAdjectives(contextpack.wordlists[i]);
        wordlists += 'Misc: \n' + this.displayMisc(contextpack.wordlists[i]);
      }
    }
    return wordlists;
  }

  displayNouns(wordlist: Wordlist){
    let nounWords: string;
    if (wordlist.nouns === undefined){
      nounWords = null;
    }
    else{
      nounWords = '';
      let i: number;
      let j: number;
        for (i = 0; i < wordlist.nouns.length; i++) {
          for(j = 0; j < wordlist.nouns[i].forms.length; j++){
            if(i === wordlist.nouns.length-1 && j === wordlist.nouns[i].forms.length-1){
              nounWords += wordlist.nouns[i].forms[j] + ' ';
            }
            else{
            nounWords += wordlist.nouns[i].forms[j] + ', ';
            }
          }
        }
        nounWords += '\n';
    }
    return nounWords;
  }

  displayAdjectives(wordlist: Wordlist){
    let adjectiveWords: string;
    if (wordlist.adjectives === undefined){
      adjectiveWords = null;
    }
    else{
      adjectiveWords = '';
      let i: number;
      let j: number;
        for (i = 0; i < wordlist.adjectives.length; i++) {
          for(j = 0; j < wordlist.adjectives[i].forms.length; j++){
            if(i === wordlist.adjectives.length-1 && j === wordlist.adjectives[i].forms.length-1){
              adjectiveWords += wordlist.adjectives[i].forms[j] + ' ';
            }
            else{
            adjectiveWords += wordlist.adjectives[i].forms[j] + ', ';
            }
          }

        }
        adjectiveWords += '\n';
    }
    return adjectiveWords;
  }

  displayVerbs(wordlist: Wordlist){
    let verbWords: string;
    if (wordlist.verbs === undefined){
      verbWords = null;
    }
    else{
      verbWords = '';
      let i: number;
      let j: number;
        for (i = 0; i < wordlist.verbs.length; i++) {
          for(j = 0; j < wordlist.verbs[i].forms.length; j++){
            if(i === wordlist.verbs.length-1 && j === wordlist.verbs[i].forms.length-1){
              verbWords += wordlist.verbs[i].forms[j] + ' ';
            }
            else{
            verbWords += wordlist.verbs[i].forms[j] + ', ';
            }
          }

        }
        verbWords += '\n';
    }
    return verbWords;
  }

  displayMisc(wordlist: Wordlist){
    let miscWords: string;
    if (wordlist.misc === undefined){
      miscWords = null;
    }
    else{
      miscWords = '';
      let i: number;
      let j: number;
        for (i = 0; i < wordlist.misc.length; i++) {
          for(j = 0; j < wordlist.misc[i].forms.length; j++){
            if(i === wordlist.misc.length-1 && j === wordlist.misc[i].forms.length-1){
              miscWords += wordlist.misc[i].forms[j] + ' ';
            }
            else{
            miscWords += wordlist.misc[i].forms[j] + ', ';
            }
          }

        }
        miscWords += '\n';
      }
    return miscWords;
  }


  downloadJson(myJson: ContextPack, topic: string, num: number){
      myJson = this.convertToBetterJson(myJson);
      const sJson = JSON.stringify(myJson, null, 2);
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/json;charset=UTF-8,' + encodeURIComponent(sJson));
      element.setAttribute('download', topic + '.json');
      element.style.display = 'none';
      document.body.appendChild(element);
      if (num === 1){
        element.click(); // simulate click
      }
      document.body.removeChild(element);
      return element;
}

  convertToBetterJson(jsonBetter: ContextPack){
    const obj: any =
      {
      $schema: 'https://raw.githubusercontent.com/kidstech/story-builder/master/Assets/packs/schema/pack.schema.json',
      name: jsonBetter.name,
      enabled: jsonBetter.enabled,
      wordlists: jsonBetter.wordlists
      };
      return obj;
  }

}
