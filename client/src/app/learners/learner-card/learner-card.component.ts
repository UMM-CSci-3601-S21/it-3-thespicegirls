import { Component, Input, OnInit } from '@angular/core';
import { Learner } from '../learner';
import { ContextPack } from '../../contextpacks/contextpack';
import { ContextPackService } from 'src/app/contextpacks/contextpack.service';
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import { threadId } from 'worker_threads';

@Component({
  selector: 'app-learner-card',
  templateUrl: './learner-card.component.html',
  styleUrls: ['./learner-card.component.scss']
})
export class LearnerCardComponent implements OnInit {

  @Input() learner: Learner;
  @Input() simple: boolean;
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
      .subscribe(contextpack => {this.assignedPacks.push(contextpack);});
    }
  }

  downloadAll(packs: ContextPack[]){
    let i=0;
    for(i; i<packs.length; i++){
      this.contextPackService.downloadJson(packs[i], packs[i].name).click();
    }
  }

  downloadLearner(){
    this.contextPackService.downloadLearnerJson(this.assignedPacks, this.learner.name).click();
  }

  // downloadZip(packs: ContextPack[]){
  //   let i=0;
  //   const newZip = new JSZip();
  //   for(i; i<packs.length; i++){
  //     newZip.file(packs[i].name, JSON.stringify[packs[i],2], {base64: true});
  //   }

  //   // this.contextPackService.downloadJson(zip.file, this.learner.name).click();
  //   newZip.generateAsync ({ type: 'blob' })
  //   .then(function(content) {
  //     FileSaver.saveAs(content, this.learner.name);
  //   });


  // }


  // downloadAZip(){
  //   const zip = new JSZip();
  //   zip.file('hello.txt', 'Hello World\n');

  //   zip.generateAsync({ type: 'blob'}).then(function(content) {
  //     FileSaver.saveAs(content, this.learner.name);
  //   });
  // }
  // downloadZip1(){
  //   const zip = new JSZip();
  //   zip.file(this.learner.name, this.downloadAll(this.assignedPacks));
  // }


}
