import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

import { SocialAuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

export let browserRefresh = false;
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


  constructor(private router: Router, private socialAuthService: SocialAuthService,
    private httpClient: HttpClient, private snackBar: MatSnackBar) {
      this.router.events
      .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
      .subscribe(event => {
        if (
          event.id === 1 &&
          event.url === event.urlAfterRedirects
        ) {
         this.logout();
        }
      });
  }

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
