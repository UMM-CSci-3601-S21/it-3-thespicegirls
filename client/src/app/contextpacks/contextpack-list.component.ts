import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContextPack } from './contextpack';
import { ContextPackService} from './contextpack.service';
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

  public contextpackName: string;

  getContextpacksSub: Subscription;


  // Inject the ContextPackService into this component.
  // That's what happens in the following constructor.
  //
  // We can call upon the service for interacting
  // with the server.

  constructor(private contextpackService: ContextPackService, private snackBar: MatSnackBar, private router: Router) {

  }

  update(contextPack: ContextPack) {
    this.contextpackService.updateContextPack(contextPack).subscribe(existingID => {
      this.snackBar.open('Updated Pack ' + contextPack.name, null, {
      duration: 2000,
    });
    this.router.navigate(['/contextpacks/', existingID]);
  }, err => {
    this.snackBar.open('Failed to update the pack', 'OK', {
      duration: 5000,
    });
  });
  }

  getContextpacksFromServer(): void {
    this.unsub();
    this.getContextpacksSub = this.contextpackService.getContextPacks().subscribe(returnedContextpacks => {
      this.serverFilteredContextpacks = returnedContextpacks;
      this.updateFilter();
    }, err => {
      console.log(err);
    });
  }

  public updateFilter(): void {
    this.filteredContextpacks = this.contextpackService.filterContextPacks(
      this.serverFilteredContextpacks, { name: this.contextpackName });
  }

  /**
   * Starts an asynchronous operation to update the contextpacks list
   *
   */
  ngOnInit(): void {
    this.getContextpacksFromServer();
  }

  ngOnDestroy(): void {
    this.unsub();
  }

  unsub(): void {
    if (this.getContextpacksSub) {
      this.getContextpacksSub.unsubscribe();
    }
  }
}
