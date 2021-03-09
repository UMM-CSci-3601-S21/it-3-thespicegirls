import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Wordlist } from './contextpack';
import { ContextPack } from './contextpack';
import { map } from 'rxjs/operators';

@Injectable()
export class ContextPackService {
  readonly contextpackUrl: string = environment.apiUrl + 'contextpacks';


  constructor(private httpClient: HttpClient) {
  }

  getContextPacks(): Observable<ContextPack[]> {
    const httpParams: HttpParams = new HttpParams();
    return this.httpClient.get<ContextPack[]>(this.contextpackUrl, {
      params: httpParams,
    });
  }



  getContextPackById(id: string): Observable<ContextPack> {
    return this.httpClient.get<ContextPack>(this.contextpackUrl + '/' + id);
  }

  filterContextPacks(contextpacks: ContextPack[], filters: { name?: string }): ContextPack[] {

    let filteredContextPack = contextpacks;

    // Filter by topic
    if (filters.name) {
      filters.name = filters.name.toLowerCase();

      filteredContextPack = filteredContextPack.filter(contextpack => contextpack.
        name.toLowerCase().indexOf(filters.name) !== -1);
    }

    return filteredContextPack;
  }

  addContextPack(newContextPack: ContextPack): Observable<string> {
    // Send post request to add a new wordlist with the wordlist data as the body.
    return this.httpClient.post<{id: string}>(this.contextpackUrl, newContextPack).pipe(map(res => res.id));
  }
}


