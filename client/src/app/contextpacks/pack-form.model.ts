import { FormArray, FormControl } from '@angular/forms';
import { ContextPack } from './contextpack';

export class ContextPackForm {
  name = new FormControl();
  enabled = new FormControl();
  wordlists = new FormArray([]);

  constructor(pack: ContextPack) {
    if (pack.name) {
      this.name.setValue(pack.name);
    }
    if (pack.wordlists) {
      this.wordlists.setValue([pack.wordlists]);
    }
  }
}
