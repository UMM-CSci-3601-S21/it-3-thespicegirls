import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WordlistCardComponent } from './wordlist-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { Word } from './wordlist';

describe('WordlistCardComponent', () => {
  let component: WordlistCardComponent;
  let component1: WordlistCardComponent;
  let component2: WordlistCardComponent;
  let component3: WordlistCardComponent;
  let fixture: ComponentFixture<WordlistCardComponent>;
  let fixture1: ComponentFixture<WordlistCardComponent>;
  let fixture2: ComponentFixture<WordlistCardComponent>;
  let fixture3: ComponentFixture<WordlistCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatCardModule
      ],
      declarations: [ WordlistCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordlistCardComponent);
    fixture1 = TestBed.createComponent(WordlistCardComponent);
    fixture2 = TestBed.createComponent(WordlistCardComponent);
    fixture3 = TestBed.createComponent(WordlistCardComponent);
    component = fixture.componentInstance;
    component1 = fixture1.componentInstance;
    component2 = fixture2.componentInstance;
    component3 = fixture3.componentInstance;
    const noun: Word = {
      word: 'you',
      forms: ['you', 'yoyo', 'yos', 'yoted']
    };
    const adjective: Word = {
      word: 'green',
      forms: ['green', 'greener']
    };
    const verb: Word = {
      word: 'ran',
      forms: ['ran', 'running']
    };
    const misc: Word = {
      word: 'langerhans',
      forms: ['langerhans']
    };
    const testNouns: Word[] = [noun];
    const testVerbs: Word[] = [verb];
    const testAdjectives: Word[] = [adjective];
    const testMisc: Word[] = [misc];

    component.wordlist = {
      _id: 'pat_id',
      enabled: false,
      topic: 'happy',
      nouns: testNouns,
      verbs: testVerbs,
      adjectives: testAdjectives
    };
    component1.wordlist = {
      _id: 'sam_id',
      enabled: false,
      topic: 'sad',
      verbs: testVerbs,
      adjectives: testAdjectives,
      misc: testMisc
    };
    component2.wordlist = {
      _id: 'mat_id',
      enabled: false,
      topic: 'mad',
      nouns: testNouns,
      adjectives: testAdjectives,
      misc: testMisc
    };
    component3.wordlist = {
      _id: 'jack_id',
      enabled: false,
      topic: 'crazy',
      nouns: testNouns,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list the nouns', () => {
    expect(component.displayNouns(component.wordlist)).toEqual('you yoyo yos yoted \n');
  });
  it('should list the verbs', () => {
    expect(component.displayVerbs(component.wordlist)).toEqual('ran running \n');
  });
  it('should list the adjectives', () => {
    expect(component.displayAdjectives(component.wordlist)).toEqual('green greener \n');
  });
  it('should list the misc words', () => {
    expect(component1.displayMisc(component1.wordlist)).toEqual('langerhans \n');
  });
  it('should not list the misc words', () => {
    expect(component.displayMisc(component.wordlist)).toEqual(null);
  });
  it('should not list the nouns words', () => {
    expect(component1.displayNouns(component1.wordlist)).toEqual(null);
  });
  it('should not list the verbs words', () => {
    expect(component2.displayVerbs(component2.wordlist)).toEqual(null);
  });
  it('should not list the adjectives words', () => {
    expect(component3.displayAdjectives(component3.wordlist)).toEqual(null);
  });

  it('should create a download element when given a json', () => {
    expect(component.downloadJson(component.wordlist, component.wordlist.topic).toString()).toContain('happy');
  });

});
