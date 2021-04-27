import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ContextPack, Word, Wordlist } from 'src/app/contextpacks/contextpack';
import { ContextPackService } from 'src/app/contextpacks/contextpack.service';
import { Learner } from '../learner';
import { LearnerService } from '../learner.service';




@Component({
  selector: 'app-learner-info',
  templateUrl: './learner-info.component.html',
  styleUrls: ['./learner-info.component.scss'],
  providers :[]
})

export class LearnerInfoComponent implements OnInit, OnDestroy {

  learner: Learner;
  id: string;
  getLearnerSub: Subscription;
  assignedPacks: ContextPack[]=[];
  assignedWords: Word[]=[];
  assignedPacksObj: AssignedPack[]=[];
  possibleWordlists: Wordlist[]=[];
  possibleContextpacks: ContextPack[]=[];


  constructor( public snackBar: MatSnackBar, private route: ActivatedRoute, private contextPackService: ContextPackService,
    private learnerService: LearnerService, private router: Router) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe((pmap) => {
      this.id = pmap.get('id');
      if (this.getLearnerSub) {
        this.getLearnerSub.unsubscribe();
      }
      this.getLearnerSub = this.learnerService.getLearnerById(this.id)
      .subscribe(learner => {
        this.learner = learner;
        this.getAssignedContextPacks();
      });
    });
  }

  ngOnDestroy(): void {
    if (this.getLearnerSub) {
      this.getLearnerSub.unsubscribe();
    }
  }

  getAssignedContextPacks(){
    let i=0;
    for(i; i<this.learner.assignedContextPacks.length; i++){
      this.contextPackService.getContextPackById(this.learner.assignedContextPacks[i])
      .subscribe(contextpack => {
      this.assignedPacks.push(contextpack);
      this.getAllWords(contextpack);
      this.getAssignedWordlists(contextpack);
      this.setWordlists(contextpack);
      }
      );
    }
    this.setContextpacks();
  }

  updateAssignedView(list: Wordlist,  pack: ContextPack){
    this.assignedWords =[];
    for(const assignObj of this.assignedPacksObj){
      if(assignObj.contextpack === pack && !assignObj.assignedWordlists.includes(list) ){
        assignObj.assignedWordlists.push(list);
        this.learner.disabledWordlists.splice(this.learner.disabledWordlists.indexOf(list.name),1);
        this.setPos(list);
      }
    }
    for(const cpack of this.assignedPacks){
      this.getAllWords(cpack);
    }
  }

  updatedisabledView(list: Wordlist,  pack: ContextPack){
    this.assignedWords =[];
    for(const assignObj of this.assignedPacksObj){
      //remove from enabled list
        (assignObj.assignedWordlists.forEach(assigned =>{
        if(assigned.name === list.name){
            assignObj.assignedWordlists.splice(assignObj.assignedWordlists.indexOf(assigned),1);
            // add to disabled wordlist
            this.learner.disabledWordlists = this.learner.disabledWordlists.concat(list.name);
            this.setPos(list);
        }
        }));
    }
    for(const cpack of this.assignedPacks){
      this.getAllWords(cpack);
    }
  }

  //sets the wordlist for each word so we know where it comes from
  setPos(list: Wordlist){
    for(const pos of ['nouns','verbs','misc','adjectives']){
      for(const word of list[`${pos}`]){word.pos =pos;
      word.wordlist=list.name;}
    }
  }

  //gets all possible words from every assigned wordlist
  getAllWords(pack: ContextPack){
      let i=0;
      for(i;i<pack.wordlists.length; i++){
        if(!this.learner.disabledWordlists.includes(pack.wordlists[i].name)){
          this.setPos(pack.wordlists[i]);
          for(const pos of ['nouns','verbs','misc','adjectives']){
          this.assignedWords = this.assignedWords.concat(pack.wordlists[i][`${pos}`]);
          }
        }
      }
    this.assignedWords.sort((a, b) => a.word.localeCompare(b.word));
  }

  //gets every assigned wordlist from assigned contextpacks
  getAssignedWordlists(pack: ContextPack){
      let i=0;
      const assignedLists: Wordlist[] =[];
      for(i; i<pack.wordlists.length; i++){
        if(!this.learner.disabledWordlists.includes(pack.wordlists[i].name)){
          assignedLists.push(pack.wordlists[i]);
        }
      }
      const assignedPackInfo = {
        contextpack: pack,
        assignedWordlists: assignedLists
      };
      this.assignedPacksObj.push(assignedPackInfo);
  }

  //for displaying wordlist names cleanly
  getListNames(assignedPacksObj){
    const names = assignedPacksObj.assignedWordlists.map(list => list.name.replace('_', ' '));
    return names;
  }

  //for the toggle dropdown, updates the enabled wordlist field
  setWordlists(pack: ContextPack){
    for(const list of pack.wordlists){
      list.pack = pack;
      if(this.learner.disabledWordlists.includes(list.name)){
        this.editListField(list.name, 'false', pack);
      } else{
        this.editListField(list.name, 'true', pack);
      }
    }
    this.possibleWordlists = this.possibleWordlists.concat(pack.wordlists);
  }

  toggleWordlist(list: Wordlist,  pack: ContextPack, enabled: boolean){
    list.enabled = !list.enabled;
    const action = enabled ? ('disable') : ('assign');
    this.editListField(list.name, list.enabled.toString(),pack);
    this.learnerService.assignWordlist(list.name, this.learner, action).subscribe(existingID => {
      if(enabled){this.updatedisabledView(list , pack);
      }else{
        this.updateAssignedView(list , pack);
      }
      }, err => {
        this.snackBar.open('Failed to reassign: ' + list.name, 'OK', {
          duration: 5000,
          });
        });;
  }

  editListField(list: string, newData: string, pack: ContextPack){
    const obj =  { enabled: newData };
    this.contextPackService.updateWordList(pack, list, obj).subscribe(existingID => {
    this.localListEdit(pack, list, newData==='true');
    }, err => {
      this.snackBar.open('Failed to update enabled status of Word list: ' + list, 'OK', {
        duration: 5000,
        });
      });
  }

  localListEdit(pack: ContextPack, listname: string, enabled: boolean){
    for(const list of pack.wordlists){
      if(list.name === listname ){
        list.enabled = enabled;
      }
    }
  }


  //for toggle dropdown, grabs all possible contextpacks
  setContextpacks(){
    const allPacks = this.contextPackService.getContextPacks().subscribe(packs => {
      this.possibleContextpacks = packs as ContextPack[];

      for(const pack of this.possibleContextpacks){
        console.log('Inside the for loop');
        if(this.learner.assignedContextPacks.includes(pack._id)){
          this.editPackField('true',pack);
        } else {
          this.editPackField('false', pack);
        }
      }});
  }

  editPackField(newData: string, pack: ContextPack){
    const obj =  { enabled: newData };
    this.contextPackService.updateContextPack(pack, obj).subscribe(existingID => {
    pack.enabled = (newData === 'true'); },
     err => {
      this.snackBar.open('Failed to update enabled status of Context Pack: ' + pack.name, 'OK', {
        duration: 5000,
        });
      });
  }

  toggleContextpack(pack: ContextPack, status: boolean){
    let action: string;
    if(status === true){
      action = 'unassign';
    }
    if(status === false){
      action = 'assign';
    }
    console.log(status);

    this.learnerService.assignContextpack(this.learner, action, pack._id).subscribe(update => {
      this.snackBar.open('Reassigned ' + pack + 'to Learner: ' + this.learner.name, null, {
        duration: 2000,
      });
      this.localContextpackToggle(pack, action);
    }, err => {
      this.snackBar.open('Failed to reassign Context Pack ' + pack, 'OK', {
        duration: 5000,
        });
    });
  }

  localContextpackToggle(pack: ContextPack, action: string){
    pack.enabled = !pack.enabled;
    const newPacksObj = {
      contextpack: pack,
      assignedWordlists: pack.wordlists,
    };
    if(action === 'assign'){
      this.learner.assignedContextPacks = this.learner.assignedContextPacks.concat(pack._id);
      this.assignedPacksObj = this.assignedPacksObj.concat(newPacksObj);
      for(const list of newPacksObj.assignedWordlists){
        this.updateAssignedView(list, pack);
        this.getAllWords(pack);
      }
    }
    if(action === 'unassign'){
      for(const obj of this.assignedPacksObj){
        if(obj.contextpack._id === pack._id){
          this.assignedPacksObj.splice(this.assignedPacksObj.indexOf(obj),1);
          this.learner.assignedContextPacks.splice(this.learner.assignedContextPacks.indexOf(pack._id),1);
        }
      }
      for(const contextpack of this.assignedPacksObj){
        for(const list of contextpack.assignedWordlists){
        this.updatedisabledView(list,contextpack.contextpack);
        }
      }
    }
  }

}

export interface AssignedPack {
  contextpack: ContextPack;
  assignedWordlists: Wordlist[];
}
