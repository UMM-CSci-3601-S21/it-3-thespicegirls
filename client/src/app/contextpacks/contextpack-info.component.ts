import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContextPack } from './contextpack';
import { ContextPackService } from './contextpack.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contextpack-info',
  templateUrl: './contextpack-info.component.html',
  styleUrls: ['./contextpack-info.component.scss'],
  providers:[]
})
export class ContextPackInfoComponent implements OnInit, OnDestroy {



  public contextpackName: string;

  contextpack: ContextPack;
  id: string;
  getContextPackSub: Subscription;

  constructor(private route: ActivatedRoute, private contextPackService: ContextPackService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    // We subscribe to the parameter map here so we'll be notified whenever
    // that changes (i.e., when the URL changes) so this component will update
    // to display the newly requested contextpack.
    this.route.paramMap.subscribe((pmap) => {
      this.id = pmap.get('id');
      if (this.getContextPackSub) {
        this.getContextPackSub.unsubscribe();
      }
      this.getContextPackSub = this.contextPackService.getContextPackById(this.id).subscribe(contextpack => this.contextpack = contextpack);
    });
  }

  ngOnDestroy(): void {
    if (this.getContextPackSub) {
      this.getContextPackSub.unsubscribe();
    }
  }

  update(contextPack: ContextPack) {
    this.contextPackService.updateContextPack(contextPack).subscribe(existingID => {
      this.snackBar.open('Updated Pack ' + contextPack.name, null, {
      duration: 2000,
    });
  }, err => {
    this.snackBar.open('Failed to update the pack', 'OK', {
      duration: 5000,
    });
  });
  }

}
