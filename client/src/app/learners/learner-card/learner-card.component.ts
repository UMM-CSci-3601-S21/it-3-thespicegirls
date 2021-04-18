import { Component, Input, OnInit } from '@angular/core';
import { Learner } from '../learner';
import { ContextPack } from '../../contextpacks/contextpack';
import { ContextPackService } from 'src/app/contextpacks/contextpack.service';

@Component({
  selector: 'app-learner-card',
  templateUrl: './learner-card.component.html',
  styleUrls: ['./learner-card.component.scss']
})
export class LearnerCardComponent implements OnInit {
  @Input() learner: Learner;
  public assignedPacks: ContextPack[];
  contextpack: ContextPack;


  constructor(private contextPackService: ContextPackService) { }

  ngOnInit(): void {
    this.getAssignedContextPacks();
  }
  getAssignedContextPacks(){
    this.assignedPacks = [];
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for(let i=0; i<this.learner.assignedContextPacks.length; i++){
     this.contextPackService.getContextPackById(this.learner.assignedContextPacks[i])
      .subscribe(contextpack => this.assignedPacks.push(contextpack));
    }
  }


}
