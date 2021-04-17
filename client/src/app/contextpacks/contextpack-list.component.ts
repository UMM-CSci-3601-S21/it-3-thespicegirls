import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContextPack } from './contextpack';
import { ContextPackService} from './contextpack.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LearnerService } from '../learners/learner.service';
import { Learner } from '../learners/learner';

@Component({
  selector: 'app-contextpack-list-component',
  templateUrl: 'contextpack-list.component.html',
  styleUrls: ['./contextpack-list.component.scss'],
  providers: []
})

export class ContextPackListComponent implements OnInit, OnDestroy  {
  // These are public so that tests can reference them (.spec.ts)
  public serverFilteredContextpacks: ContextPack[];
  public filteredContextpacks: ContextPack[];
  public serverFilteredLearners: Learner[];
  public filteredLearners: Learner[];

  public contextpack: ContextPack;
  public contextpackName: string;
  public learnerName: string;

  getContextpacksSub: Subscription;
  getLearnersSub: Subscription;

  constructor(
    private learnerService: LearnerService, private contextpackService: ContextPackService,
    private snackBar: MatSnackBar, private router: Router) {}

  getContextpacksFromServer(): void {
    this.unsubContextpack();
    this.getContextpacksSub = this.contextpackService.getContextPacks().subscribe(returnedContextpacks => {
      this.serverFilteredContextpacks = returnedContextpacks;
      this.updateContextpackFilter();
    }, err => {
      console.log(err);
    });
  }

  getLearnersFromServer(): void {
    this.unsubLearner();
    this.getLearnersSub = this.learnerService.getLearners().subscribe(returnedLearners => {
      this.serverFilteredLearners = returnedLearners;
      this.updateLearnerFilter();
    }, err => {
      console.log(err);
    });
  }

  public updateContextpackFilter(): void {
    this.filteredContextpacks = this.contextpackService.filterContextPacks(
      this.serverFilteredContextpacks, { name: this.contextpackName });
  }

  public updateLearnerFilter(): void {
    this.filteredLearners = this.learnerService.filterLearners(
      this.serverFilteredLearners, { name: this.learnerName });
  }

  ngOnInit(): void {
    this.getContextpacksFromServer();
    this.getLearnersFromServer();
  }

  ngOnDestroy(): void {
    this.unsubContextpack();
    this.unsubLearner();
  }

  unsubContextpack(): void {
    if (this.getContextpacksSub) {
      this.getContextpacksSub.unsubscribe();
    }
  }

  unsubLearner(): void {
    if (this.getLearnersSub) {
      this.getLearnersSub.unsubscribe();
    }
  }

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
    this.contextpackService.updateContextPack(contextPack, obj).subscribe(existingID => {
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
      contextpack.name =obj.name;
    }
    if(obj.enabled){
      contextpack.name =obj.name;
    }
    if(obj.icon){
      contextpack.icon = obj.icon;
    }
    this.ngOnInit();
  }
}
