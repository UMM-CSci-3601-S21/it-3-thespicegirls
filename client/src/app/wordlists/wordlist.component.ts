import { Component, OnInit } from '@angular/core';
import { ContextPack } from './contextpack';
import { WordlistService } from './wordlist.service';

@Component({
  selector: 'app-wordlist',
  templateUrl: './wordlist.component.html',
  styleUrls: ['./wordlist.component.scss']
})
export class WordlistComponent implements OnInit {

  public serverFilteredWordlists: ContextPack[];

  public packName: string;

  constructor(private wordlistService: WordlistService) { }

  getContextPacksFromServer(): void {
    this.wordlistService.getContextPacks({
      name: this.packName
    }).subscribe(returnedLists =>{
      this.serverFilteredWordlists = returnedLists;
    }, err => {
      console.log(err);
    });
  }

  ngOnInit(): void {
    this.getContextPacksFromServer();
  }
  stringList(contextPack: ContextPack){
    return JSON.stringify(contextPack);
  }

}
