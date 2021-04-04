import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SocialAuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

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
  subscription: Subscription;


  constructor(private socialAuthService: SocialAuthService,
    private httpClient: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.httpClient.get<string>(this.idTokenUrl + '/' + 'loggedin').subscribe(res => {
      const user2 = new SocialUser();
      user2.firstName = res.toString();
      this.user = user2;
      this.isSignedin = true;
  });

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
    this.httpClient.get<string>(this.idTokenUrl + '/' + 'logout').subscribe(res => {
      this.isSignedin = false;
  });
  }

  returnTitle(){
    return 'Word River';
  }

  addGoogleToken(token: string): Observable<string>{
    console.log(this.idTokenUrl);
    return this.httpClient.post<{id: string}>(this.idTokenUrl, token).pipe(map(res => res.id));
  }

}
