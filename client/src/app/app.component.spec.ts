/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SocialLoginModule, SocialUser } from 'angularx-social-login';
import {  NO_ERRORS_SCHEMA } from '@angular/compiler';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable, of, throwError } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { User } from './contextpacks/user';

describe('Context Pack service: ', () => {

  const userSmall: SocialUser = {
    provider: 'none',
    id: '12345',
    email: 'joe@mail',
    name: 'joe',
    photoUrl: 'joePicture',
    firstName: 'joe',
    lastName: 'jo',
    authToken: '54321',
    idToken: '98765',
    authorizationCode: '56789',
    response: 'good'
  };
   const goodUser = new Observable<SocialUser>((observer) => {

    // observable execution
    observer.next(userSmall);
    observer.complete();
});
const observableString = new Observable<string>((observer) => {

  // observable execution
  observer.next('12345');
  observer.complete();
});
const userTest: User = {
  name: 'Thomas',
  admin: true
};


  let appService: AppComponent;
  // These are used to mock the HTTP requests so that we (a) don't have to
  // have the server running and (b) we can check exactly which HTTP
  // requests were made to ensure that we're making the correct requests.
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let matSnackBar: MatSnackBar;
  let spy: any;
  let spy2: any;
  let spy3: any;

  let apiSpy: any;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({

      imports: [ HttpClientTestingModule, ReactiveFormsModule, MatSnackBarModule, SocialLoginModule, BrowserAnimationsModule ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
    apiSpy = jasmine.createSpyObj('SocialAuthService', ['signIn', 'signOut', 'authState']);
    httpClient = TestBed.inject(HttpClient);
    matSnackBar = TestBed.inject(MatSnackBar);
    httpTestingController = TestBed.inject(HttpTestingController);

    appService = new AppComponent(apiSpy, httpClient,  matSnackBar);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it(`should have as title 'Word River'`, () => {
    expect(appService).toBeTruthy();
    expect(appService.returnTitle()).toEqual('Word River');
  });

  it(`should spy on socialAuthState()`, () => {
    apiSpy.authState = goodUser;
    expect(appService.socialAuthState()).toEqual(goodUser);

  });

  it(`should call logout() if it gets a bad request at sendToServer()`, () => {
    appService.isSignedin = false;
    spy = spyOn(appService, 'socialAuthState').and.returnValue(goodUser);
    spy2 = spyOn(appService, 'addGoogleToken').and.returnValue(throwError({status: 404}));
    appService.sendToServer();

    const req = httpTestingController.expectOne(appService.idTokenUrl + '/logout');
    expect(req.request.method).toEqual('GET');
    expect(appService.isSignedin).toBeFalsy();
    expect(appService.user).toEqual(userSmall);
    expect(appService.user.name).toEqual('joe');
    expect(spy).toHaveBeenCalled();

  });

  it(`should spy on sendToServer()`, () => {
    spy = spyOn(appService, 'socialAuthState').and.returnValue(goodUser);
    spy2 = spyOn(appService, 'addGoogleToken').and.returnValue(observableString);
    spyOn(localStorage.__proto__, 'setItem').and.returnValue('true');
    spy3 = spyOn(appService, 'reload').and.returnValue();
    appService.sendToServer();

    expect(appService.user).toEqual(userSmall);
    expect(appService.user.name).toEqual('joe');
    expect(localStorage.__proto__.setItem).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });
  it(`should spy on sendToServer() and make sure it makes an api request to api/users`, () => {
    appService.isSignedin = false;
    spy = spyOn(appService, 'socialAuthState').and.returnValue(goodUser);

    appService.sendToServer();
    const req = httpTestingController.expectOne(appService.idTokenUrl);
    expect(req.request.method).toEqual('POST');
    expect(appService.user).toEqual(userSmall);
    expect(appService.user.name).toEqual('joe');
    expect(spy).toHaveBeenCalled();

  });

  it(`should spy on socialAuth() and make sure it does the right thing with successful subscription`, () => {

    spy = spyOn(appService, 'socialAuthState').and.returnValue(goodUser);
    appService.socialAuthState().subscribe();
    expect(appService.socialAuthState()).toEqual(goodUser);
    expect(spy).toHaveBeenCalled();
  });

  it(`should spy on googleSignIn`, () => {
    spy = spyOn(appService, 'sendToServer');
    appService.googleSignin();
    expect(spy).toHaveBeenCalled();
    expect(apiSpy.signIn).toHaveBeenCalledTimes(1);
  });
  it(`should spy on logout and change isSignedIn to false`, () => {
    appService.isSignedin = true;
    spy = spyOn(appService, 'reload').and.returnValue();
    spy2 = spyOn(appService, 'sendLogOutToServer').and.callFake(() => of( 'true' ));
    appService.logout();
    expect(appService.isSignedin).toBeFalsy();
    expect(apiSpy.signOut).toHaveBeenCalledTimes(1);
  });

  it(`should make an api request to api/user/logout when sendLogoutToServer() is called`, () => {
    appService.sendLogOutToServer().subscribe(
    );
    const req = httpTestingController.expectOne(appService.idTokenUrl + '/logout');
    expect(req.request.method).toEqual('GET');
  });

  it(`should post an api request to api/users and get a string back when addGoogleToken() is called`, () => {

    appService.addGoogleToken('me').subscribe();
    const req = httpTestingController.expectOne(appService.idTokenUrl);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual('me');

    //Now we spy and make sure that it does something with the response
    spy2 = spyOn(appService, 'addGoogleToken').and.callFake(() => of( 'Hello' ));
    appService.addGoogleToken('bobby').subscribe(
      user => expect(user).toBe('Hello'),
    );
    req.flush({id: 'Happy'});
  });

  it(`should make an api request to api/user/loggedin with askServerIfLoggedIn`, () => {
    appService.askServerIfLoggedIn().subscribe();
    const req = httpTestingController.expectOne(appService.idTokenUrl + '/loggedin');
    expect(req.request.method).toEqual('GET');
  });

  it(`should return a fake response for ngOnInit so it sets the right values for user`, () => {
    appService.isSignedin = false;
    spy2 = spyOn(appService, 'askServerIfLoggedIn').and.callFake(() => of( userTest ));
    spyOn(localStorage.__proto__, 'setItem').and.returnValue('true');

    appService.ngOnInit();
    expect(localStorage.__proto__.setItem).toHaveBeenCalled();
    expect(appService.user.firstName).toEqual('Thomas');
    expect(appService.isSignedin).toBeTruthy();
  });

});
