import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ContextPackCardComponent } from './contextpack-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { Word, Wordlist } from './contextpack';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ContextPackService } from './contextpack.service';
import { MockContextPackService } from 'src/testing/contextpack.service.mock';
import {MatChipsModule} from '@angular/material/chips';
import { workerData } from 'worker_threads';
import { HttpClient } from '@angular/common/http';


describe('ContextPackCardComponent', () => {

  let component: ContextPackCardComponent;
  let fixture: ComponentFixture<ContextPackCardComponent>;
  let component2: ContextPackCardComponent;
  let fixture2: ComponentFixture<ContextPackCardComponent>;
  let emptyWordlist: Wordlist;
  let contextpackService: ContextPackService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatCardModule,
        MatSnackBarModule
      ],
      declarations: [ ContextPackCardComponent ],
      providers: [{ provide: ContextPackService, useValue: new MockContextPackService() }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextPackCardComponent);
    fixture2 = TestBed.createComponent(ContextPackCardComponent);
    contextpackService = new MockContextPackService();

    component = fixture.componentInstance;
    component2 = fixture2.componentInstance;

    const noun: Word = {
      word: 'you',
      forms: ['you', 'yoyo', 'yos', 'yoted']
    };
    const noun2: Word = {
      word: 'goat',
      forms: ['goat', 'goats']
    };
    const adjective: Word = {
      word: 'green',
      forms: ['green', 'greener']
    };
    const verb: Word = {
      word: 'run',
      forms: ['ran', 'running']
    };
    const verb2: Word = {
      word: 'walk',
      forms: ['walks', 'walking']
    };
    const misc: Word = {
      word: 'langerhans',
      forms: ['langerhans', 'langerhan']
    };
    const testNouns: Word[] = [noun,noun2];
    const testVerbs: Word[] = [verb,verb2];
    const testAdjectives: Word[] = [adjective];
    const testMisc: Word[] = [misc];
    emptyWordlist ={

    };

    const testWordListBig: Wordlist[] = [{
      name: 'howdy',
      enabled: true,
      nouns: testNouns,
      verbs: testVerbs,
      adjectives: testAdjectives,
      misc: testMisc
    },
 ];

    component.contextpack = {
      _id: 'pat_id',
      enabled: true,
      name: 'happy',
      wordlists: testWordListBig
    };
    component2.contextpack = {
      _id: 'mat_id',
      enabled: true,
      name: 'Joy',
    };


    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have displayNouns,verbs,adjective,misc return null if undefined', () => {
    expect(component.displayWords(emptyWordlist, 'nouns')).toBeNull();
    expect(component.displayWords(emptyWordlist, 'verbs')).toBeNull();
    expect(component.displayWords(emptyWordlist, 'adjectives')).toBeNull();
    expect(component.displayWords(emptyWordlist, 'misc')).toBeNull();
  });

  it('should create a download element when given a json', () => {
    expect(component.downloadJson(component.contextpack, component.contextpack.name).toString()).toContain('happy');

  });
  it('should convert a json into a correctly formatted json', () => {
    expect(component.convertToBetterJson(component.contextpack).$schema).
    toEqual('https://raw.githubusercontent.com/kidstech/story-builder/master/Assets/packs/schema/pack.schema.json');
    expect(component.convertToBetterJson(component.contextpack).id).toBeUndefined();
  });

  describe('Word display on cards', () => {
    it('should display the nouns with no forms',()=>{
      expect(component.displayWordsNoForms(component.contextpack, 'nouns').length).toEqual(2);
      expect(component.displayWordsNoForms(component.contextpack, 'nouns')[0]).toEqual('you');
    });
    it('should display the verbs with no forms',()=>{
      expect(component.displayWordsNoForms(component.contextpack, 'verbs').length).toEqual(2);
      expect(component.displayWordsNoForms(component.contextpack, 'verbs')[0]).toEqual('run');
      expect(component.displayWordsNoForms(component.contextpack, 'verbs')[1]).toEqual('walk');
    });
    it('should display the misc with no forms',()=>{
      expect(component.displayWordsNoForms(component.contextpack, 'misc').length).toEqual(1);
      expect(component.displayWordsNoForms(component.contextpack, 'misc')[0]).toEqual('langerhans');
    });
    it('should display the adjectives with no forms',()=>{
      expect(component.displayWordsNoForms(component.contextpack, 'adjectives').length).toEqual(1);
      expect(component.displayWordsNoForms(component.contextpack, 'adjectives')[0]).toEqual('green');
    });
  });

  describe('Delete a word', () => {
    it('should delete a noun', () => {

    });
    it('should delete a verb', () => {

    });
    it('should delete a adjective', () => {

    });
    it('should delete a misc', () => {

    });
  });
});
