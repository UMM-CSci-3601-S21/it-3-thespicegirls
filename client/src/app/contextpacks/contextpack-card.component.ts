import { Component, OnInit, Input } from '@angular/core';
import { ContextPack } from './contextpack';

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



  displayNouns(contextpack: ContextPack){
    let nounsWords: string;
    let m: number;
    let name: string;
    for (m =0; m< contextpack.wordlists.length; m++){
      if (contextpack.wordlists[m].nouns.length === 0){
        nounsWords = null;
      }
      else{
        nounsWords = '';
        let i: number;
        let j: number;
        let p: number;
        let n: number;
        n = 0;
        for (j =0; j< contextpack.wordlists.length; j++){
          name = contextpack.wordlists[j].name;
          for (i = 0; i < contextpack.wordlists[j].nouns.length; i++) {
            for(p = 0; p < contextpack.wordlists[j].nouns[i].forms.length; p++){
              if(i===0 && p ===0 && j === 0){
                nounsWords = name + ': \n \n' + nounsWords;
              }

              if(i===0 && p ===0 && j ===1 +n){
                nounsWords =  nounsWords + name + ': \n \n';
                n = n + 1;
              }

              nounsWords += contextpack.wordlists[j].nouns[i].forms[p] + ' ';
            }
            if(i !== contextpack.wordlists[j].nouns.length-1 ){
            nounsWords += ' ,';
            }
          }
          nounsWords += '\n';
          nounsWords += '\n';
          nounsWords = '\n' +  nounsWords ;
        }


      }
      return nounsWords;
    }
  }




  displayAdjectives(contextpack: ContextPack){
    let adjectiveWords: string;
    let m: number;
    let name: string;
    for (m =0; m< contextpack.wordlists.length; m++){
      if (contextpack.wordlists[m].adjectives.length === 0 ){
        adjectiveWords = null;
      }
      else{
        adjectiveWords = '';
        let i: number;
        let j: number;
        let p: number;
        let n: number;
        n = 0;
        for (j =0; j< contextpack.wordlists.length; j++){
          name = contextpack.wordlists[j].name;
          for (i = 0; i < contextpack.wordlists[j].adjectives.length; i++) {
            for(p = 0; p < contextpack.wordlists[j].adjectives[i].forms.length; p++){
              if(i===0 && p ===0 && j === 0){
                adjectiveWords = name + ': \n \n' + adjectiveWords;
              }

              if(i===0 && p ===0 && j === 1 + n){
                adjectiveWords =  adjectiveWords + name + ': \n \n';
                n = n + 1;
              }

              adjectiveWords += contextpack.wordlists[j].adjectives[i].forms[p] + ' ';
            }
            if(i !== contextpack.wordlists[j].adjectives.length-1 ){
            adjectiveWords += ' ,';
            }
          }

          adjectiveWords += '\n';
          adjectiveWords += '\n';
          adjectiveWords = '\n' +  adjectiveWords ;
        }


      }
      return adjectiveWords;
    }
  }





  displayVerbs(contextpack: ContextPack){
    let verbsWords: string;
    let m: number;
    let name: string;
    for (m =0; m< contextpack.wordlists.length; m++){
      if (contextpack.wordlists[m].verbs.length === 0){
        verbsWords = null;
      }
      else{
        verbsWords = '';
        let i: number;
        let j: number;
        let p: number;
        let n: number;
        n = 0;
        for (j =0; j< contextpack.wordlists.length; j++){
          name = contextpack.wordlists[j].name;
          for (i = 0; i < contextpack.wordlists[j].verbs.length; i++) {
            for(p = 0; p < contextpack.wordlists[j].verbs[i].forms.length; p++){
              if(i===0 && p ===0 && j === 0){
                verbsWords = name + ': \n \n' + verbsWords;
              }

              if(i===0 && p ===0 && j === 1 + n){
                verbsWords =  verbsWords + name + ': \n \n';
                n = n + 1;
              }

              verbsWords += contextpack.wordlists[j].verbs[i].forms[p] + ' ';
            }
            if(i !== contextpack.wordlists[j].verbs.length-1 ){
              verbsWords += ' ,';
            }
          }

          verbsWords += '\n';
          verbsWords += '\n';
          verbsWords = '\n' +  verbsWords ;
        }


      }
      return verbsWords;
    }
  }



  displayMisc(contextpack: ContextPack){
    let miscWords: string;
    let m: number;
    let name: string;
    for (m =0; m< contextpack.wordlists.length; m++){
      if (contextpack.wordlists[m].misc.length === 0){
        miscWords = null;
      }
      else{
        miscWords = '';
        let i: number;
        let j: number;
        let p: number;
        let n: number;
        n = 0;
        for (j =0; j< contextpack.wordlists.length; j++){
          name = contextpack.wordlists[j].name;
          for (i = 0; i < contextpack.wordlists[j].misc.length; i++) {
            for(p = 0; p < contextpack.wordlists[j].misc[i].forms.length; p++){
              if(i===0 && p ===0 && j === j){
                miscWords = name + ': \n \n' + miscWords;
              }

              if(i===0 && p ===0 && j === 1 + n){
                miscWords =  miscWords + name + ': \n \n';
                n = n +1;
              }

              miscWords += contextpack.wordlists[j].verbs[i].forms[p] + ' ';
            }
            if(i !== contextpack.wordlists[j].verbs.length-1 ){
              miscWords += ' ,';
            }
          }

          miscWords += '\n';
          miscWords += '\n';
          miscWords = '\n' +  miscWords ;
        }


      }
      return miscWords;
    }
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
