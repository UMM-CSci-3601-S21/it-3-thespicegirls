import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Learner } from '../learner';
import { LearnerService } from '../learner.service';

@Component({
  selector: 'app-learner-list',
  templateUrl: './learner-list.component.html',
  styleUrls: ['./learner-list.component.scss']
})
export class LearnerListComponent implements OnInit, OnDestroy {

  public serverFilteredLearners: Learner[];
  public filteredLearners: Learner[];
  public contextpackName: string;
  public learnerName: string;

  getLearnersSub: Subscription;


  constructor(private learnerService: LearnerService) { }

  ngOnInit(): void {
    this.getLearnersFromServer();
  }
  ngOnDestroy(): void {
    this.unsubLearner();
  }

  getLearnersFromServer(): void {
    this.unsubLearner();
    this.getLearnersSub = this.learnerService.getLearners().subscribe(returnedLearners => {
      this.serverFilteredLearners = returnedLearners;
      this.updateLearnerFilter();
      console.log(this.serverFilteredLearners);
    }, err => {
      console.log(err);
    });
  }
  public updateLearnerFilter(): void {
    this.filteredLearners = this.learnerService.filterLearners(
      this.serverFilteredLearners, { name: this.learnerName });
  }
  unsubLearner(): void {
    if (this.getLearnersSub) {
      this.getLearnersSub.unsubscribe();
    }
  }



}
