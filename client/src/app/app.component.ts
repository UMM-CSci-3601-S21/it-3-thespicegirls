import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from './contextpacks/user';
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
    this.askServerIfLoggedIn().subscribe(res => {
      const user2 = new SocialUser();
      user2.firstName = res.name;
      this.user = user2;
      this.isSignedin = true;
      localStorage.setItem('loggedIn', 'true');
      if(res.admin === true){
        localStorage.setItem('admin', 'true');
      }
  }, err =>{
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('admin');
  });
  }
  askServerIfLoggedIn(): Observable<User>{
    return this.httpClient.get<User>(this.idTokenUrl + '/' + 'loggedin');
  }

  sendToServer() {
    this.socialAuthState().subscribe((user) => {
      this.user = user;
      console.log(this.user);
      this.addGoogleToken(this.user.idToken).subscribe(newID => {
        this.snackBar.open('Logged into server', null, {
          duration: 2000,
        });
        console.log(newID);
        if(newID === 'true'){
          localStorage.setItem('admin', 'true');
        }
        localStorage.setItem('loggedIn', 'true');
        this.reload();
      }, err => {
        this.snackBar.open('Failed login to server', 'OK', {
          duration: 5000,
        });
        this.isSignedin = false;
        localStorage.setItem('loggedIn', 'false');
        localStorage.setItem('admin', 'false');
        this.logout();
      });
    });
    return this.isSignedin;
  }

  socialAuthState(): Observable<SocialUser>{
    return this.socialAuthService.authState;
  }

  googleSignin(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.sendToServer();
  }

  logout(): void {
    this.socialAuthService.signOut();
    this.sendLogOutToServer().subscribe(res => {
      this.isSignedin = false;
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('admin');
      this.reload();
  });
  }

  reload(): void{
    window.location.reload();
  }

  sendLogOutToServer(): Observable<string>{
    return this.httpClient.get<string>(this.idTokenUrl + '/' + 'logout');
  }

  returnTitle(){
    return 'Word River';
  }

  addGoogleToken(token: string): Observable<string>{
    console.log(this.idTokenUrl);
    return this.httpClient.post<{id: string}>(this.idTokenUrl, token).pipe(map(res => res.id));
  }

}
