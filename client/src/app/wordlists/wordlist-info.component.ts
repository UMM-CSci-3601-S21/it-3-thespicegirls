import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Wordlist } from './wordlist';
import { WordlistService } from './wordlist.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wordlist-info',
  templateUrl: './wordlist-info.component.html',
  styleUrls: ['./wordlist-info.component.scss']
})
export class WordlistInfoComponent implements OnInit, OnDestroy {

  wordlist: Wordlist;
  id: string;
  getWordlistSub: Subscription;

  constructor(private route: ActivatedRoute, private wordlistService: WordlistService) { }

  ngOnInit(): void {
    // We subscribe to the parameter map here so we'll be notified whenever
    // that changes (i.e., when the URL changes) so this component will update
    // to display the newly requested wordlist.
    this.route.paramMap.subscribe((pmap) => {
      this.id = pmap.get('id');
      if (this.getWordlistSub) {
        this.getWordlistSub.unsubscribe();
      }
      this.getWordlistSub = this.wordlistService.getWordlistById(this.id).subscribe(wordlist => this.wordlist = wordlist);
    });
  }

  ngOnDestroy(): void {
    if (this.getWordlistSub) {
      this.getWordlistSub.unsubscribe();
    }
  }

}
