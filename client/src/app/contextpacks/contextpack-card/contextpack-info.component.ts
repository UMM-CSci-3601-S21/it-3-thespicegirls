import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContextPack } from '../contextpack';
import { ContextPackService } from '../contextpack.service';
import { Subscription } from 'rxjs';
import { MatSnackBar} from '@angular/material/snack-bar';

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

  constructor(private route: ActivatedRoute, private snackBar: MatSnackBar,
    private contextPackService: ContextPackService, private router: Router) { }

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

  update(contextPack: ContextPack, event: string[]) {
    if(event.length === 3){
      this.editField(event[0],event[1],event[2]);
    }
    if(event.length === 2){
      this.contextPackService.updateField(contextPack,event);
    }
  }

  editField(list: string, newData: string, field: string){
    let obj: any;
    switch(field){
      case 'name':obj =  { name: newData };
        break;
      case 'enabled':obj =  { enabled: newData };
        break;
    }
    this.contextPackService.updateWordList(this.contextpack, list, obj).subscribe(existingID => {
      this.snackBar.open('Updated enabled status of Word list: ' + list, null, {
      duration: 3000,
    });
    this.localEdit(list, obj);
    }, err => {
      this.snackBar.open('Failed to update enabled status of Word list: ' + list, 'OK', {
        duration: 5000,
        });
      });
  }

  localEdit(list: string, obj: any){
    let i;
    for(i=0;i<this.contextpack.wordlists.length; i++){
      if(this.contextpack.wordlists[i].name === list){
        if(obj.name){
          this.contextpack.wordlists[i].name = obj.name;
        }
        if(obj.enabled){
          this.contextpack.wordlists[i].enabled = obj.enabled;
        }
      }
    }
    this.ngOnInit();
  }

}
