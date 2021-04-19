import { Component, OnDestroy, OnInit } from '@angular/core';

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

  constructor(private route: ActivatedRoute, private contextPackService: ContextPackService,
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
        this.setPos(pack.wordlists[i]);
        for(const pos of ['nouns','verbs','misc','adjectives']){
        this.assignedWords = this.assignedWords.concat(pack.wordlists[i][`${pos}`]);
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

}
export interface AssignedPack {
  contextpack: ContextPack;
  assignedWordlists: Wordlist[];
}
