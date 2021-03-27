import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContextPack, Word } from './contextpack';
import { ContextPackService } from './contextpack.service';

@Component({
  selector: 'app-edit-contextpack',
  templateUrl: './edit-contextpack.component.html',
  styleUrls: ['./edit-contextpack.component.scss']
})
export class EditContextpackComponent implements OnInit {

  @Input() contextpack: ContextPack;
  @Input() word: Word;
  @Input() value!: string;
  @Output() valueChangeEvents: EventEmitter<string>;
  isEditing: boolean;
  pendingValue: string;

  constructor( private contextPackService: ContextPackService) {
    this.isEditing = false;
		this.pendingValue = '';
		this.valueChangeEvents = new EventEmitter();
   }

  ngOnInit(): void {
  }

  	// I cancel the editing of the value.
	public cancel(): void {

		this.isEditing = false;

	}


	// I enable the editing of the value.
	public edit(): void {

		this.pendingValue = this.value;
		this.isEditing = true;

	}


	// I process changes to the pending value.
	public processChanges(): void {

		// If the value actually changed, emit the change but don't change the local
		// value - we don't want to break unidirectional data-flow.
		if ( this.pendingValue !== this.value ) {

			this.valueChangeEvents.emit( this.pendingValue.toString() );

		}

		this.isEditing = false;

	}

  public updateContextPack(): void {
    this.contextPackService.updateContextPack(
      this.contextpack, { name: this.contextpack.name});
  }
}
