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
  selected = 'true';

  constructor() { }

  ngOnInit(): void {
  }

  displayWordlists(contextpack: Wordlist){
    let  wordlists: string;
      wordlists = '';
        wordlists += 'Word List ' + 'Name: ' + contextpack.name + '\n';
        wordlists += 'Enabled: ' + contextpack.enabled + '\n';
        wordlists += 'Nouns: \n' + this.displayNouns(contextpack);
        wordlists += 'Verbs: \n' + this.displayVerbs(contextpack);
        wordlists += 'Adjectives: \n' + this.displayAdjectives(contextpack);
        wordlists += 'Misc: \n' + this.displayMisc(contextpack);
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


  displayAllNouns(contextpack: ContextPack){
      let nounsWords: string;
      let m: number;
      if (contextpack.wordlists === undefined || contextpack.wordlists[0].nouns === undefined){
        nounsWords = null;
      }
      else{
      for (m =0; m < contextpack.wordlists.length; m++){
          nounsWords = '';
          let i: number;
          let j: number;
          let p: number;
          for (j =0; j< contextpack.wordlists.length; j++){
            for (i = 0; i < contextpack.wordlists[j].nouns.length; i++) {
              for(p = 0; p < contextpack.wordlists[j].nouns[i].forms.length; p++){
                nounsWords += contextpack.wordlists[j].nouns[i].forms[p] + ', ';
              }
            }
          }
          nounsWords = '\n'+ nounsWords;
          nounsWords=nounsWords.slice(0,nounsWords.length-2);
        }
      }
      return nounsWords;
  }
  displayAllVerbs(contextpack: ContextPack){
    let verbWords: string;
    let m: number;
    if (contextpack.wordlists === undefined || contextpack.wordlists[0].verbs === undefined){
      verbWords = null;
    }
      else{
        for (m =0; m< contextpack.wordlists.length; m++){
        verbWords = '';
        let i: number;
        let j: number;
        let p: number;
        for (j =0; j< contextpack.wordlists.length; j++){
          for (i = 0; i < contextpack.wordlists[j].verbs.length; i++) {
            for(p = 0; p < contextpack.wordlists[j].verbs[i].forms.length; p++){
              verbWords += contextpack.wordlists[j].verbs[i].forms[p] + ', ';
            }
          }
        }
        verbWords = '\n'+ verbWords;
        verbWords=verbWords.slice(0,verbWords.length-2);
      }
    }
    return verbWords;

  }
  displayAllAdjectives(contextpack: ContextPack){
    let adjectivesWords: string;
    let m: number;
    if (contextpack.wordlists === undefined || contextpack.wordlists[0].adjectives === undefined){
      adjectivesWords = null;
    }
      else{
        for (m =0; m< contextpack.wordlists.length; m++){
        adjectivesWords = '';
        let i: number;
        let j: number;
        let p: number;
        for (j =0; j< contextpack.wordlists.length; j++){
          for (i = 0; i < contextpack.wordlists[j].adjectives.length; i++) {
            for(p = 0; p < contextpack.wordlists[j].adjectives[i].forms.length; p++){
              adjectivesWords += contextpack.wordlists[j].adjectives[i].forms[p] + ', ';
            }
          }
        }
        adjectivesWords = '\n'+ adjectivesWords;
        adjectivesWords=adjectivesWords.slice(0,adjectivesWords.length-2);
      }
    }
    return adjectivesWords;
  }
  displayAllMisc(contextpack: ContextPack){
    let miscWords: string;
    let m: number;
    if ( contextpack.wordlists === undefined || contextpack.wordlists[0].misc === undefined){
      miscWords = null;
    }
      else{
        for (m =0; m< contextpack.wordlists.length; m++){
        miscWords = '';
        let i: number;
        let j: number;
        let p: number;
        for (j =0; j< contextpack.wordlists.length; j++){
          for (i = 0; i < contextpack.wordlists[j].misc.length; i++) {
            for(p = 0; p < contextpack.wordlists[j].misc[i].forms.length; p++){
              miscWords += contextpack.wordlists[j].misc[i].forms[p] + ', ';
            }
          }
        }
        miscWords = '\n'+ miscWords;
        miscWords=miscWords.slice(0,miscWords.length-2);
      }
    }
    return miscWords;
  }
}
