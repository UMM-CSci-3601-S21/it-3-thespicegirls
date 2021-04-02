import { of } from 'rxjs';

export class MatSnackBarStub{
  open(){
    return {
      onAction: () => of({})
    };
  }
}
