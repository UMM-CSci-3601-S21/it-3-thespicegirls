import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Wordlist } from '../contextpacks/contextpack';
import { Learner } from './learner';

@Injectable({
  providedIn: 'root'
})
export class LearnerService {
  readonly learnerUrl: string = environment.apiUrl + 'learners';
  readonly idTokenUrl: string = environment.apiUrl + 'users';

  constructor(private httpClient: HttpClient) { }

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
  assignWordlist(listname: string ,learner: Learner){
    let httpParams: HttpParams = new HttpParams();
    httpParams = httpParams.set('assign',listname);

    return this.httpClient.get<Learner>(this.learnerUrl + '/' + learner._id +'/assign', {
      params: httpParams,
   });
  }

  addLearner(newLearner: Learner): Observable<string>{
    return this.httpClient.post<{id: string}>(this.learnerUrl, newLearner).pipe(map(res => res.id));
  }

}
