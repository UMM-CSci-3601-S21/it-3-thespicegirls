import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SocialAuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  user: SocialUser;
  isSignedin: boolean;
  title: string;
  readonly idTokenUrl: string = environment.apiUrl + 'users';

  constructor(private socialAuthService: SocialAuthService, private httpClient: HttpClient, private snackBar: MatSnackBar) { }

  ngOnInit() {

  }

  sendToServer() {
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      console.log(this.user);
      this.addGoogleToken(this.user.idToken).subscribe(newID => {
        this.snackBar.open('Logged into server', null, {
          duration: 2000,
        });
        this.isSignedin = (true);
      }, err => {
        this.snackBar.open('Failed login to server', 'OK', {
          duration: 5000,
        });
        this.isSignedin = false;
        this.logout();
      });
    });
    return this.isSignedin;
  }

  googleSignin(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.sendToServer();
  }

  logout(): void {
    this.socialAuthService.signOut();
    this.isSignedin = (false);
  }
  returnTitle(){
    return 'Word River';
  }

  addGoogleToken(token: string): Observable<string>{
    // Send post request to add a new user with the user data as the body.

    console.log(this.idTokenUrl);
    return this.httpClient.post<{id: string}>(this.idTokenUrl, token).pipe(map(res => res.id));
    // const xhr = new XMLHttpRequest();
    // xhr.open('POST', this.idTokenUrl);
    // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    // xhr.send(token);
  }
}
