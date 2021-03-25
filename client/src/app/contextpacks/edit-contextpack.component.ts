import { Component, Input, OnInit } from '@angular/core';
import { ContextPack } from './contextpack';

@Component({
  selector: 'app-edit-contextpack',
  templateUrl: './edit-contextpack.component.html',
  styleUrls: ['./edit-contextpack.component.scss']
})
export class EditContextpackComponent implements OnInit {

  @Input() contextpack: ContextPack;

  constructor() { }

  ngOnInit(): void {
  }

}
