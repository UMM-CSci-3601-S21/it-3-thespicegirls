import { Component, OnInit, Input } from '@angular/core';
import { ContextPack } from './contextpack';

@Component({
  selector: 'app-contextpack-card',
  templateUrl: './contextpack-card.component.html',
  styleUrls: ['./contextpack-card.component.scss']
})
export class ContextPackCardComponent implements OnInit {

  @Input() contextpack: ContextPack;
  @Input() simple ? = false;

  constructor() { }

  ngOnInit(): void {
  }


  downloadJson(myJson: ContextPack, topic: string){
    const sJson = JSON.stringify(myJson, null, 2);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=UTF-8,' + encodeURIComponent(sJson));
    element.setAttribute('download', topic + '.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click(); // simulate click
    document.body.removeChild(element);
    return element;
}

}
