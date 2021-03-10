import { FormArray, FormControl } from '@angular/forms';
import { ContextPack, Word, Wordlist } from './contextpack';

export class NounForm {
  word = new FormControl();
  forms = new FormArray([]);
  constructor(word: Word) {
    if (word.word) {
      this.word.setValue(word.word);
    }
    if (word.forms) {
      this.forms.setValue([word.forms]);
    }
  }
}
