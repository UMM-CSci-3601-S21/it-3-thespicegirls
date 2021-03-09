import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { MockWordlistService } from '../../testing/contextpack.service.mock';
import { Wordlist } from './contextpack';
import { WordlistCardComponent } from './contextpack-card.component';
import { WordlistListComponent } from './contextpack-list.component';
import { WordlistService } from './contextpack.service';
import { MatIconModule } from '@angular/material/icon';

const COMMON_IMPORTS: any[] = [
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatButtonModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatListModule,
  MatDividerModule,
  MatRadioModule,
  MatIconModule,
  BrowserAnimationsModule,
  RouterTestingModule,
];

describe('Wordlist list', () => {

  let wordlistList: WordlistListComponent;
  let fixture: ComponentFixture<WordlistListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [WordlistListComponent, WordlistCardComponent],
      // providers:    [ WordlistService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{ provide: WordlistService, useValue: new MockWordlistService() }]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(WordlistListComponent);
      wordlistList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('contains all the wordlists', () => {
    expect(wordlistList.serverFilteredWordlists.length).toBe(3);
  });

  it('contains a wordlist named \'fun\'', () => {
    expect(wordlistList.serverFilteredWordlists.some((wordlist: Wordlist) => wordlist.topic === 'fun')).toBe(true);
  });

  it('contain a wordlist named \'happy\'', () => {
    expect(wordlistList.serverFilteredWordlists.some((wordlist: Wordlist) => wordlist.topic === 'happy')).toBe(true);
  });
  it('contain a wordlist named \'sun\'', () => {
    expect(wordlistList.serverFilteredWordlists.some((wordlist: Wordlist) => wordlist.topic === 'sun')).toBe(true);
  });
});

describe('Misbehaving Wordlist List', () => {
  let wordlistList: WordlistListComponent;
  let fixture: ComponentFixture<WordlistListComponent>;

  let wordlistServiceStub: {
    getWordlists: () => Observable<Wordlist[]>;
    getWordlistsFiltered: () => Observable<Wordlist[]>;
  };

  beforeEach(() => {
    // stub WordlistService for test purposes
    wordlistServiceStub = {
      getWordlists: () => new Observable(observer => {
        observer.error('Error-prone observable');
      }),
      getWordlistsFiltered: () => new Observable(observer => {
        observer.error('Error-prone observable');
      })
    };

    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [WordlistListComponent],
      // providers:    [ WordlistService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{ provide: WordlistService, useValue: wordlistServiceStub }]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(WordlistListComponent);
      wordlistList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('generates an error if we don\'t set up a WordlistListService', () => {
    // Since the observer throws an error, we don't expect wordlists to be defined.
    expect(wordlistList.serverFilteredWordlists).toBeUndefined();
  });
});
