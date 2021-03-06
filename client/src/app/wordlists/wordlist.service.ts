import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Word } from './word';
import { Wordlist } from './wordlist';
import { map } from 'rxjs/operators';

@Injectable()
export class WordlistService {
  readonly wordlistUrl: string = environment.apiUrl + 'wordlists';

  constructor(private httpClient: HttpClient) {
  }

  getWordlists(filters?: {  topic?: string }): Observable<Wordlist[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.topic) {
        httpParams = httpParams.set('topic', filters.topic);
      }
    }
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

  addWordlist(newWordlist: Wordlist): Observable<string> {
    // Send post request to add a new wordlist with the wordlist data as the body.
    return this.httpClient.post<{id: string}>(this.wordlistUrl, newWordlist).pipe(map(res => res.id));
  }
}
