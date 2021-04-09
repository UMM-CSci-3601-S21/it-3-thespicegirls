import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ContextPack } from './contextpack';
import { map } from 'rxjs/operators';

@Injectable()
export class ContextPackService {
  readonly contextpackUrl: string = environment.apiUrl + 'contextpacks';
  readonly idTokenUrl: string = environment.apiUrl + 'users';
  constructor(private httpClient: HttpClient) {
  }

  checkIfLoggedIn(log: string){
    let isSignedIn: boolean;
    if (log === 'true'){
      isSignedIn = true;
    }
    else{
      isSignedIn = false;
    }
    return isSignedIn;

  }
  checkIfAdmin(log: string){
    let isAdmin: boolean;
    if (log === 'true'){
      isAdmin = true;
    }
    else{
      isAdmin = false;
    }
    return isAdmin;

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

   if(newValues !== null){
    if(newValues.name){httpParams = httpParams.set('name', newValues.name);}
    if(newValues.enabled){httpParams = httpParams.set('enabled',newValues.enabled);}
    if(newValues.icon){httpParams = httpParams.set('icon',newValues.icon);}}

    return this.httpClient.post<ContextPack>(this.contextpackUrl + '/' + contextpack._id +'/editpack', null , {
      params: httpParams
   });

  }

  addWord(contextpack: ContextPack, listname: string, addValues: {noun?: string; verb?: string; adjective?: string; misc?: string}){
    let httpParams: HttpParams = new HttpParams();
    httpParams = httpParams.set('listname', listname);

    if(addValues.noun){httpParams = httpParams.set('addnoun',addValues.noun);}
    if(addValues.verb){httpParams = httpParams.set('addverb',addValues.verb);}
    if(addValues.adjective){httpParams = httpParams.set('addadj',addValues.adjective);}
    if(addValues.misc){httpParams = httpParams.set('addmisc',addValues.misc);}

    return this.httpClient.post<ContextPack>(this.contextpackUrl + '/' + contextpack._id +'/editlist', null , {
      params: httpParams
   });
  }

  deleteWord(contextpack: ContextPack, listname: string, delValues: {noun?: string; verb?: string; adjective?: string; misc?: string}){
    let httpParams: HttpParams = new HttpParams();
    httpParams = httpParams.set('listname', listname);

    if(delValues.noun){httpParams = httpParams.set('delnoun',delValues.noun);}
    if(delValues.verb){httpParams = httpParams.set('delverb',delValues.verb);}
    if(delValues.adjective){httpParams = httpParams.set('deladj',delValues.adjective);}
    if(delValues.misc){httpParams = httpParams.set('delmisc',delValues.misc);}

    return this.httpClient.post<ContextPack>(this.contextpackUrl + '/' + contextpack._id +'/editlist', null , {
      params: httpParams
   });
  }

  updateWordList(contextpack: ContextPack, listname: string, editValues: {name?: string; enabled?: string}): Observable<ContextPack> {

    let httpParams: HttpParams = new HttpParams();
    httpParams = httpParams.set('listname', listname);

    if(editValues.name){httpParams = httpParams.set('name',editValues.name);}
    if(editValues.enabled){httpParams = httpParams.set('enabled',editValues.enabled);}

    return this.httpClient.post<ContextPack>(this.contextpackUrl + '/' + contextpack._id +'/editlist', null , {
      params: httpParams
   });
  }

}


