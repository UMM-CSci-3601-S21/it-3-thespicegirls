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

  public contextpack: ContextPack;
  public contextpackName: string;

  getContextpacksSub: Subscription;

  constructor(private contextpackService: ContextPackService, private snackBar: MatSnackBar, private router: Router) {}

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
