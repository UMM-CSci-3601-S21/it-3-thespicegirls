import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  checkIfLoggedIn(log: string){
    let isSignedIn: boolean;
    if (log === 'true'){
      isSignedIn = true;
    }
    else{
      isSignedIn = false;
    }
    return isSignedIn;
  }

  checkIfAdmin(log: string){
    let isAdmin: boolean;
    if (log === 'true'){
      isAdmin = true;
    }
    else{
      isAdmin = false;
    }
    return isAdmin;
  }
}
