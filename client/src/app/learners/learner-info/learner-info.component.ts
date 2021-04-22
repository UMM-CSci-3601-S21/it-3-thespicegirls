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
  assignedPacks: ContextPack[] =[];
  assignedWords: Word[]=[];
  assignedPacksTest: AssignedPack[]=[];

  possibleWordlists: Wordlist[]=[];


  constructor( public snackBar: MatSnackBar, private route: ActivatedRoute, private contextPackService: ContextPackService,
    private learnerService: LearnerService, private router: Router) { }


  ngOnInit(): void {
    // We subscribe to the parameter map here so we'll be notified whenever
    // that changes (i.e., when the URL changes) so this component will update
    // to display the newly requested contextpack.
    this.route.paramMap.subscribe((pmap) => {
      this.id = pmap.get('id');
      if (this.getLearnerSub) {
        this.getLearnerSub.unsubscribe();
      }
      this.getLearnerSub = this.learnerService.getLearnerById(this.id)
      .subscribe(learner =>{this.learner = learner;
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

  }
  setPos(list: Wordlist){
    for(const pos of ['nouns','verbs','misc','adjectives']){
      for(const word of list[`${pos}`]){word.pos =pos;
      word.wordlist=list.name;}
    }
  }
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
      this.assignedPacksTest.push(assignedPackInfo);
  }
  getListNames(assignedPacksTest){
    const names = assignedPacksTest.assignedWordlists.map(list => list.name.replace('_', ' '));
    return names;
  }

  setWordlists(pack: ContextPack){
    for(const list of pack.wordlists){
      list.pack = pack;
      if(this.learner.disabledWordlists.includes(list.name)){
        this.editField(list.name, 'false', pack);
      } else{
        this.editField(list.name, 'true', pack);
      }
    }
    this.possibleWordlists = this.possibleWordlists.concat(pack.wordlists);
  }
  toggleWordlist(list: Wordlist,  pack: ContextPack){
    this.editField(list.name, list.enabled.toString(),pack);
    this.learnerService.assignWordlist(list.name, this.learner).subscribe(existingID => {
      this.updateAssignedView(list , pack );
      }, err => {
        this.snackBar.open('Failed to assign: ' + list.name, 'OK', {
          duration: 5000,
          });
        });;
  }
  updateAssignedView(list: Wordlist,  pack: ContextPack){
    for(const assignObj of this.assignedPacksTest){
      if(assignObj.contextpack === pack && !assignObj.assignedWordlists.includes(list) ){
        assignObj.assignedWordlists.push(list);
        this.learner.disabledWordlists= this.learner.disabledWordlists.splice(0,this.learner.disabledWordlists.indexOf(list.name));
        this.setPos(list);
        for(const pos of ['nouns','verbs','misc','adjectives']){
        this.assignedWords = this.assignedWords.concat(list[`${pos}`]);
        }
      }
    }
    this.assignedWords.sort((a, b) => a.word.localeCompare(b.word));
  }

  editField(list: string, newData: string, pack: ContextPack){
    const obj =  { enabled: newData };
    this.contextPackService.updateWordList(pack, list, obj).subscribe(existingID => {
    this.localEdit(pack, list, newData==='true');
    }, err => {
      this.snackBar.open('Failed to update enabled status of Word list: ' + list, 'OK', {
        duration: 5000,
        });
      });;
  }

  localEdit(pack: ContextPack, listname: string, enabled: boolean){
    for(const list of pack.wordlists){
      if(list.name === listname ){
        list.enabled = enabled;
      }
    }
  }
}



export interface AssignedPack {
  contextpack: ContextPack;
  assignedWordlists: Wordlist[];
}
