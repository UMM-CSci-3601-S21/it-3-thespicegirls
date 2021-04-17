import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Learner } from './learner';

@Injectable({
  providedIn: 'root'
})
export class LearnerService {
  readonly learnerUrl: string = environment.apiUrl + 'learners';

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
}
