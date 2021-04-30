import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContextPack } from '../contextpack';
import { ContextPackService} from '../contextpack.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

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

  public contextpack: ContextPack;
  public contextpackName: string;

  public viewType: 'learner' | 'card' = 'card';

  getContextpacksSub: Subscription;

  constructor(
    private contextpackService: ContextPackService,
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

  updateField(contextPack: ContextPack, event: string[]): void {
    this.contextpackService.updateField(contextPack, event);
  }

  public updateContextpackFilter(): void {
    this.filteredContextpacks = this.contextpackService.filterContextPacks(
      this.serverFilteredContextpacks, { name: this.contextpackName });
  }

  ngOnInit(): void {
    this.getContextpacksFromServer();
  }

  ngOnDestroy(): void {
    this.unsubContextpack();
  }

  unsubContextpack(): void {
    if (this.getContextpacksSub) {
      this.getContextpacksSub.unsubscribe();
    }
  }

}
