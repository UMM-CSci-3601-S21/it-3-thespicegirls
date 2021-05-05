import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Learner } from './learner';

@Injectable({
  providedIn: 'root'
})
export class LearnerService {
  readonly learnerUrl: string = environment.apiUrl + 'learners';
  readonly idTokenUrl: string = environment.apiUrl + 'users';

  constructor(private httpClient: HttpClient) { }

  getLearners(): Observable<Learner[]> {
    const httpParams: HttpParams = new HttpParams();
    return this.httpClient.get<Learner[]>(this.learnerUrl, {
      params: httpParams,
    });
  }

  getLearnerById(id: string): Observable<Learner> {
    return this.httpClient.get<Learner>(this.learnerUrl + '/' + id);
  }

  filterLearners(learners: Learner[], filters: { name?: string }): Learner[] {

    let filteredLearners = learners;

    // Filter by topic
    if (filters.name) {
      filters.name = filters.name.toLowerCase();

      filteredLearners = filteredLearners.filter(learner => learner.name.toLowerCase().indexOf(filters.name) !== -1);
    }

    return filteredLearners;
  }

  assignWordlist(listname: string ,learner: Learner, action: string){
    let httpParams: HttpParams = new HttpParams();
    httpParams = httpParams.set(action,listname);

    return this.httpClient.get<Learner>(this.learnerUrl + '/' + learner._id +'/assignWordlist', {
      params: httpParams,
   });
  }

  assignContextpack(learner: Learner, action: string, pack: string){
    let httpParams: HttpParams = new HttpParams();
    httpParams = httpParams.set(action, pack);

    return this.httpClient.post<Learner>(this.learnerUrl + '/' + learner._id + '/assignPack', null, {
      params: httpParams,
    });
  }

  addLearner(newLearner: Learner): Observable<string>{
    const learnerName = newLearner.name.trim();
    if (learnerName.length > 0)
    {return this.httpClient.post<{id: string}>(this.learnerUrl, newLearner).pipe(map(res => res.id));}
    else
    {alert('Unable to add learner without a valid name'); };
  }

}
