import { Component, OnInit, OnDestroy } from '@angular/core';
import { Wordlist } from './wordlist';
import { WordlistService } from './wordlist.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wordlist-list-component',
  templateUrl: 'wordlist-list.component.html',
  styleUrls: ['./wordlist-list.component.scss'],
  providers: []
})

export class WordlistListComponent implements OnInit, OnDestroy  {
  // These are public so that tests can reference them (.spec.ts)
  public serverFilteredWordlists: Wordlist[];
  public filteredWordlists: Wordlist[];

  public wordlistTopic: string;
  public wordlistNoun: number;
  public wordlistAdjective: string;
  public wordlistMisc: string;
  getWordlistsSub: Subscription;


  // Inject the WordlistService into this component.
  // That's what happens in the following constructor.
  //
  // We can call upon the service for interacting
  // with the server.

  constructor(private wordlistService: WordlistService) {

  }

  getWordlistsFromServer(): void {
    this.unsub();
    this.getWordlistsSub = this.wordlistService.getWordlists({
      topic: this.wordlistTopic
    }).subscribe(returnedWordlists => {
      this.serverFilteredWordlists = returnedWordlists;
      this.updateFilter();
    }, err => {
      console.log(err);
    });
  }

  public updateFilter(): void {
    this.filteredWordlists = this.wordlistService.filterWordlists(
      this.serverFilteredWordlists, { topic: this.wordlistTopic });
  }

  /**
   * Starts an asynchronous operation to update the wordlists list
   *
   */
  ngOnInit(): void {
    this.getWordlistsFromServer();
  }

  ngOnDestroy(): void {
    this.unsub();
  }

  unsub(): void {
    if (this.getWordlistsSub) {
      this.getWordlistsSub.unsubscribe();
    }
  }
}
