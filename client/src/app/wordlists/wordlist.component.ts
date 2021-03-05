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

  getWordlistsFromServer(): void {
    this.wordlistService.getWordlists({
      name: this.packName
    }).subscribe(returnedLists =>{
      this.serverFilteredWordlists = returnedLists;
    }, err => {
      console.log(err);
    });
  }

  ngOnInit(): void {
    this.getWordlistsFromServer();
  }
  stringList(contextPack: ContextPack){
    return JSON.stringify(contextPack);
  }

}
