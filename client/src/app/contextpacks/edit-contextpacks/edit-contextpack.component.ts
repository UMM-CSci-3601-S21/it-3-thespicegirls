import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-edit-contextpack',
  templateUrl: './edit-contextpack.component.html',
  styleUrls: ['./edit-contextpack.component.scss']
})
export class EditContextpackComponent implements OnInit {

  @Input() value: string;
  @Output() valueChangeEvents: EventEmitter<string>;

  isEditing: boolean;
  pendingValue: string;

  constructor() {
    this.isEditing = false;
		this.pendingValue = '';
		this.valueChangeEvents = new EventEmitter();
   }

  ngOnInit(): void {
  }

	public cancel(): void {

		this.isEditing = false;

	}

	public edit(): void {

		this.pendingValue = this.value;
		this.isEditing = true;

	}

	public processChanges(): void {

		if ( this.pendingValue !== this.value ) {
			this.valueChangeEvents.emit( this.pendingValue );
		}

		this.isEditing = false;
	}
}
