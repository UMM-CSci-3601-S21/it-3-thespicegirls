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
  downloadAll(packs: ContextPack[]){
    let i=0;
    for(i; i<packs.length; i++){
      this.downloadJson(packs[i], packs[i].name).click();
    }

  }
  downloadJson(myJson: ContextPack, topic: string){
    myJson = this.convertToBetterJson(myJson);
    const sJson = JSON.stringify(myJson, null, 2);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=UTF-8,' + encodeURIComponent(sJson));
    element.setAttribute('download', topic + '.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    document.body.removeChild(element);
    return element;
  }
  convertToBetterJson(jsonBetter: ContextPack){
    const obj: any =
      {
      $schema: 'https://raw.githubusercontent.com/kidstech/story-builder/master/Assets/packs/schema/pack.schema.json',
      name: jsonBetter.name,
      icon: jsonBetter.icon,
      enabled: jsonBetter.enabled,
      wordlists: jsonBetter.wordlists
      };
      return obj;
  }


}
