import { Component, OnInit, Input } from '@angular/core';
import { of } from 'rxjs';
import { Wordlist } from './contextpack';

@Component({
  selector: 'app-wordlist-card',
  templateUrl: './wordlist-card.component.html',
  styleUrls: ['./wordlist-card.component.scss']
})
export class WordlistCardComponent implements OnInit {

  @Input() wordlist: Wordlist;
  @Input() simple ? = false;

  constructor() { }

  ngOnInit(): void {
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
            nounWords += wordlist.nouns[i].forms[j] + ' ';
          }
          nounWords += '\n';
        }
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
            adjectiveWords += wordlist.adjectives[i].forms[j] + ' ';
          }
        adjectiveWords += '\n';
        }
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
            verbWords += wordlist.verbs[i].forms[j] + ' ';
          }
          verbWords += '\n';
        }
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
            miscWords += wordlist.misc[i].forms[j] + ' ';
          }
          miscWords += '\n';
        }
      }
    return miscWords;
  }

  downloadJson(myJson: Wordlist, topic: string){
    const sJson = JSON.stringify(myJson, null, 1);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=UTF-8,' + encodeURIComponent(sJson));
    element.setAttribute('download', topic + '.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click(); // simulate click
    document.body.removeChild(element);
    return element;
}

}
