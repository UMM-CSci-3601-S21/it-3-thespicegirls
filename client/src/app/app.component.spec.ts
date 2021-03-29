import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppModule } from './app.module';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatListModule } from '@angular/material/list';
import { GoogleLoginProvider, SocialLoginModule, SocialAuthServiceConfig, SocialUser, SocialAuthService } from 'angularx-social-login';
import { BrowserModule } from '@angular/platform-browser';
import { PartialObserver } from 'rxjs';
import { userInfo } from 'os';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule, HttpClient } from '@angular/common/http';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authService: SocialAuthService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        MatToolbarModule,
        MatIconModule,
        MatSidenavModule,
        MatCardModule,
        MatSnackBarModule,
        MatListModule,
        SocialLoginModule,
        BrowserModule,
        RouterTestingModule,
        HttpClientModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        {
          provide: 'SocialAuthServiceConfig',
          useValue: {
            autoLogin: false,
            providers: [
              {
                id: GoogleLoginProvider.PROVIDER_ID,
                provider: new GoogleLoginProvider(
                  '239479898228-jsa8kqtcnqg96v8r74j2mp9jbbp01scu.apps.googleusercontent.com'
                )
              }
            ]
          } as SocialAuthServiceConfig,
        },
        SocialAuthService

      ],
    }).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(SocialAuthService);
    component.ngOnInit();
    component.user = new SocialUser();
    component.user.firstName = 'happy';
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(component).toBeTruthy();
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Word River'`, () => {
    const app = fixture.componentInstance;
    expect(app.returnTitle()).toEqual('Word River');
  });

  it(`should run google signIn()`, () => {
    expect(component.googleSignin()).toBeUndefined();
  });

  it(`should run google logOut()`, () => {
    expect(component.logout()).toBeUndefined();
  });


});
