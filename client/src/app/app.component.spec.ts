/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { User } from './contextpacks/user';
import { AppComponent } from './app.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { GoogleLoginProvider, LoginProvider, SocialAuthService,
  SocialAuthServiceConfig, SocialLoginModule, SocialUser } from 'angularx-social-login';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/compiler';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';

describe('Context Pack service: ', () => {
  // A small collection of test contextpacks


  const one = new Promise<void>((resolve, reject) => {});
  const one2 = new Promise<SocialUser>((resolve, reject) => {});

  class MockConfig{
    autoLogin: false;
    providers: {
        id: '12345';
        provider: LoginProvider;
    }[];
    onError?: (error: any) => any;
  }

  let appService: AppComponent;
  // These are used to mock the HTTP requests so that we (a) don't have to
  // have the server running and (b) we can check exactly which HTTP
  // requests were made to ensure that we're making the correct requests.
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let matSnackBar: MatSnackBar;
  let socialAuthService: SocialAuthService;
  let spy: any;
  let spy2: any;
  let config: MockConfig;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({

      imports: [ HttpClientTestingModule, ReactiveFormsModule, MatSnackBarModule, SocialLoginModule ],
      providers: [{
        provide: 'SocialAuthServiceConfig',
        useValue: {
          autoLogin: true,
          providers: [
            {
              id: 'cool ID',
              provider: new GoogleLoginProvider(
                'somethingcool.google.bing.yahoo'
              )
            }
          ]
        } as SocialAuthServiceConfig,
      }

],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
    httpClient = TestBed.inject(HttpClient);
    matSnackBar = TestBed.inject(MatSnackBar);
    httpTestingController = TestBed.inject(HttpTestingController);
    socialAuthService = TestBed.inject(SocialAuthService);
    // Construct an instance of the service with the mock
    // HTTP client.
    appService = new AppComponent(socialAuthService, httpClient,  matSnackBar);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it(`should have as title 'Word River'`, () => {

    expect(appService.returnTitle()).toEqual('Word River');
  });

  it(`should spy on login`, () => {
    spy = spyOn(socialAuthService, 'signIn');
    appService.googleSignin();
    expect(spy).toHaveBeenCalled();
  });
  it(`should spy on sendToServer`, () => {
    spy = spyOn(appService, 'sendToServer');
    appService.googleSignin();
    expect(spy).toHaveBeenCalled();
  });
  it(`should spy on logout and change isSignedIn to false`, () => {
    appService.isSignedin = true;
    spy = spyOn(socialAuthService, 'signOut').and.returnValue(one);
    spy2 = spyOn(appService, 'sendLogOutToServer').and.callFake(() => of( 'true' ));
    appService.logout();
    expect(appService.isSignedin).toBeFalsy();
    expect(spy).toHaveBeenCalled();
  });

  it(`should make an api request to api/user/logout`, () => {
    appService.sendLogOutToServer().subscribe(
    );
    const req = httpTestingController.expectOne(appService.idTokenUrl + '/logout');
    expect(req.request.method).toEqual('GET');
  });

  it(`should post an api request to api/users and get a string back`, () => {

    appService.addGoogleToken('me').subscribe();
    const req = httpTestingController.expectOne(appService.idTokenUrl);
    expect(req.request.method).toEqual('POST');

    //Now we spy and make sure that it does something with the response
    spy2 = spyOn(appService, 'addGoogleToken').and.callFake(() => of( 'Hello' ));
    appService.addGoogleToken('bobby').subscribe(
      user => expect(user).toBe('Hello')
    );
  });

  it(`should make an api request to api/user/loggedin with askServerIfLoggedIn`, () => {
    appService.askServerIfLoggedIn().subscribe();
    const req = httpTestingController.expectOne(appService.idTokenUrl + '/loggedin');
    expect(req.request.method).toEqual('GET');
  });

  it(`should return a fake response for ngOnInit so it sets the right values for user`, () => {
    spy2 = spyOn(appService, 'askServerIfLoggedIn').and.callFake(() => of( 'Billy' ));

    appService.ngOnInit();
    expect(appService.user.firstName).toEqual('Billy');
    expect(appService.isSignedin).toBeTruthy();
  });


});
