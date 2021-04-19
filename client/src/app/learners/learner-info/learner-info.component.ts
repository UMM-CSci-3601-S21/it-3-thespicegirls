import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ContextPack, Word, Wordlist } from 'src/app/contextpacks/contextpack';
import { ContextPackService } from 'src/app/contextpacks/contextpack.service';
import { Learner } from '../learner';
import { LearnerService } from '../learner.service';
import {MatChipsModule} from '@angular/material/chips';
import {MatGridListModule} from '@angular/material/grid-list';
import { ThemePalette } from '@angular/material/core';

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
        this.getAllWords();
      });
    });

  }
  ngOnDestroy(): void {
    if (this.getLearnerSub) {
      this.getLearnerSub.unsubscribe();
    }

  }

  getAssignedContextPacks(){
    const packs: ContextPack[] =[];
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for(let i=0; i<this.learner.assignedContextPacks.length; i++){
     this.contextPackService.getContextPackById(this.learner.assignedContextPacks[i])
      .subscribe(contextpack => {
      this.assignedPacks.push(contextpack);
      this.getAllWords();
      }
      );
    }

  }
  setPos(list: Wordlist){
    for(const pos of ['nouns','verbs','misc','adjectives']){
      for(const word of list[`${pos}`]){word.pos =pos;}
    }
  }

  getAllWords(){
    for(const pack of this.assignedPacks){
      let i=0;
      for(i;i<pack.wordlists.length; i++){
        this.setPos(pack.wordlists[i]);
        for(const pos of ['nouns','verbs','misc','adjectives']){
        this.assignedWords = this.assignedWords.concat(pack.wordlists[i][`${pos}`]);
        }
      }
    }
  }

}
