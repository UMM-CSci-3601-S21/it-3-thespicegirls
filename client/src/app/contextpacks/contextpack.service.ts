import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ContextPack } from './contextpack';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ContextPackService {
  readonly contextpackUrl: string = environment.apiUrl + 'contextpacks';
  readonly idTokenUrl: string = environment.apiUrl + 'users';
  constructor(private httpClient: HttpClient, public snackBar: MatSnackBar) {
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

  deleteWordlist(contextpack: ContextPack, listname: string){
    let httpParams: HttpParams = new HttpParams();
    httpParams = httpParams.set('listname', listname);
    httpParams = httpParams.set('delwordlist', 'true');

    return this.httpClient.post<ContextPack>(this.contextpackUrl + '/' + contextpack._id +'/editlist', null , {
      params: httpParams
   });
  }
  addWordlist(contextpack: ContextPack, listname: string){
    let httpParams: HttpParams = new HttpParams();
    httpParams = httpParams.set('addwordlist', listname);
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

  downloadJson(myJson: ContextPack, topic: string){
    myJson = this.convertToBetterJson(myJson);
    const sJson = JSON.stringify(myJson, null, 2);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=UTF-8,' + encodeURIComponent(sJson));
    element.setAttribute('download', topic + '.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    document.body.removeChild(element);
    return element;
  }

  convertToBetterJson(jsonBetter: ContextPack){
    const obj: any =
      {
      $schema: 'https://raw.githubusercontent.com/kidstech/story-builder/master/Assets/packs/schema/pack.schema.json',
      name: jsonBetter.name,
      icon: jsonBetter.icon,
      enabled: jsonBetter.enabled,
      wordlists: jsonBetter.wordlists
      };
      return obj;
  }

  downloadLearnerJson(packs: ContextPack[], learner: string){
    const learnersJson = {
      contextpacks: packs.map(this.convertToBetterJson),
    };
      const sJson = JSON.stringify(learnersJson, null, 2);
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/json;charset=UTF-8,' + encodeURIComponent(sJson));
      element.setAttribute('download', learner + '.json');
      element.style.display = 'none';
      document.body.appendChild(element);
      document.body.removeChild(element);
    return element;

  }

  //for use in contextpack info and list - moved here to satisfy BetterCodeHub
  updateField(contextPack: ContextPack, event: string[]): void {
    //to figure out what field is being changed so the correct http param can be sent
    let obj: any;
    switch(event[1]){
      case 'name':obj =  {name: event[0]};
        break;
      case 'enabled':obj =   {enabled: event[0]};
        break;
      case 'icon':obj =  {icon: event[0]};
        break;
    }
    this.updateContextPack(contextPack, obj).subscribe(existingID => {
      this.snackBar.open('Updated field ' + event[1] + ' of pack ' + contextPack.name, null, {
      duration: 2000,
    });
    this.updateLocalFields(contextPack, obj);
    }, err => {
      this.snackBar.open('Failed to update the ' + event[1] + ' field with value ' + event[0], 'OK', {
        duration: 5000,
      });
    });
  }

  updateLocalFields(contextpack: ContextPack, obj: any){
    if(obj.name){
      contextpack.name = obj.name;
    }
    if(obj.icon){
      contextpack.icon = obj.icon;
    }
  }

}


