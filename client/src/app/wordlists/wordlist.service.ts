import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { ContextPack } from './contextpack';

@Injectable({
  providedIn: 'root'
})
export class WordlistService {
  readonly packUrl: string = environment.apiUrl + 'contextpacks';

  constructor(private httpClient: HttpClient) {

   }

  getWordlists(filters?: { name?: string}): Observable<ContextPack[]>{
    let httpParams: HttpParams = new HttpParams();

    return this.httpClient.get<ContextPack[]>(this.packUrl, {
      params: httpParams,
    });
  }
}
