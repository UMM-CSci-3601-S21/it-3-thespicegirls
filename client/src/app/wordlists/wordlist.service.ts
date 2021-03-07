import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Wordlist } from './wordlist';
import { map } from 'rxjs/operators';

@Injectable()
export class WordlistService {
  readonly wordlistUrl: string = environment.apiUrl + 'wordlists';

  constructor(private httpClient: HttpClient) {
  }

  getWordlists(): Observable<Wordlist[]> {
    const httpParams: HttpParams = new HttpParams();
    return this.httpClient.get<Wordlist[]>(this.wordlistUrl, {
      params: httpParams,
    });
  }

  getWordlistById(id: string): Observable<Wordlist> {
    return this.httpClient.get<Wordlist>(this.wordlistUrl + '/' + id);
  }

  filterWordlists(wordlists: Wordlist[], filters: { topic?: string }): Wordlist[] {

    let filteredWordlists = wordlists;

    // Filter by topic
    if (filters.topic) {
      filters.topic = filters.topic.toLowerCase();

      filteredWordlists = filteredWordlists.filter(wordlist => wordlist.topic.toLowerCase().indexOf(filters.topic) !== -1);
    }

    return filteredWordlists;
  }
}
