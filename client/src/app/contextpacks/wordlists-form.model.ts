import { FormArray, FormControl, Validators } from '@angular/forms';
import { Wordlist } from './contextpack';

export class WordlistForm {
  name = new FormControl();
  enabled = new FormControl();
  nouns = new FormArray([]);

}
