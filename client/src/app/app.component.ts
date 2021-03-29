import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { SocialAuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { Observable, UnsubscriptionError } from 'rxjs';
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
  readonly idTokenUrl: string = environment.apiUrl + 'idtoken=';

  constructor(private socialAuthService: SocialAuthService, private httpClient: HttpClient, private snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit() {
    this.sendToServer();
  }

  sendToServer() {
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      console.log(this.user);
      this.addGoogleToken(this.user.idToken).subscribe(newID => {
        this.snackBar.open('Logged into server', null, {
          duration: 2000,
        });
        this.isSignedin = (user != null);
        // this.router.navigate(['/contextpacks/', newID]);
      }, err => {
        this.snackBar.open('Failed login to server', 'OK', {
          duration: 5000,
        });
        this.logout();
      });

      ;
    });
  }

  googleSignin(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  logout(): void {
    this.socialAuthService.signOut();
  }
  returnTitle(){
    return 'Word River';
  }

  addGoogleToken(token: string): Observable<string> {
    // Send post request to add a new user with the user data as the body.
    console.log(this.httpClient.get<string>(this.idTokenUrl + token));
    return this.httpClient.get<string>(this.idTokenUrl + token);
  }
}
