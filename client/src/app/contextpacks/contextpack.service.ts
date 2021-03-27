import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
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

    let filteredContextPacks = contextpacks;

    // Filter by topic
    if (filters.name) {
      filters.name = filters.name.toLowerCase();

      filteredContextPacks = filteredContextPacks.filter(contextpack => contextpack.name.toLowerCase().indexOf(filters.name) !== -1);
    }

    return filteredContextPacks;
  }

  addContextPack(newPack: ContextPack): Observable<string> {
    // Send post request to add a new context pack with the new data as the body.
    return this.httpClient.post<{id: string}>(this.contextpackUrl, newPack).pipe(map(res => res.id));
  }

  updateContextPack(contextpack: ContextPack, newValues?: {name?: string; enabled?: string; icon?: string}): Observable<ContextPack> {
   let httpParams: HttpParams = new HttpParams();

     if(newValues.name){
       httpParams = httpParams.set('name', newValues.name);
     }
     if(newValues.enabled){
      httpParams = httpParams.set('enabled',newValues.enabled);
    }
    if(newValues.icon){
      httpParams = httpParams.set('icon',newValues.icon);
    }

     return this.httpClient.post<ContextPack>(this.contextpackUrl + '/' + contextpack._id +'/edit', null , {
      params: httpParams
   });

  }


   deleteWord(contextpack: ContextPack, delValues: {delverb?: string; enabled?: string; icon?: string}): Observable<string> {
    let httpParams: HttpParams = new HttpParams();

      if(delValues.delverb){
        httpParams = httpParams.set('name', delValues.delverb);
      }
     httpParams = httpParams.set('listname', contextpack.name);
     return this.httpClient.post<string>(this.contextpackUrl + '/' + contextpack._id +'/editlist', {
         params: httpParams,
      });
    }


}


