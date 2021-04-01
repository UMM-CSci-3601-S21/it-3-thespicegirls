import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ContextPackCardComponent } from './contextpack-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { ContextPack, Word, Wordlist } from './contextpack';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ContextPackService } from './contextpack.service';
import { MockContextPackService } from 'src/testing/contextpack.service.mock';
import {MatChipsModule} from '@angular/material/chips';
import { workerData } from 'worker_threads';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';


describe('ContextPackCardComponent', () => {

  let component: ContextPackCardComponent;
  let fixture: ComponentFixture<ContextPackCardComponent>;
  let component2: ContextPackCardComponent;
  let fixture2: ComponentFixture<ContextPackCardComponent>;
  let emptyWordlist: Wordlist;
  let contextpackService: ContextPackService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatCardModule,
        MatSnackBarModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [ ContextPackCardComponent ],
      providers: [{ provide: ContextPackService, useValue: new MockContextPackService()}]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    contextpackService = new ContextPackService(httpClient);
  });

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
    const testContextPacks: ContextPack[] =
    [
      {
        _id: 'chris_id',
        name: 'fun',
        enabled: true,
        wordlists: testWordListBig
      },
      {
        _id: 'pat_id',
        name: 'sun',
        enabled: true,
        wordlists: testWordListBig
      },
      {
        _id: 'jamie_id',
        name: 'happy',
        enabled: true,
        wordlists: testWordListBig
      }
  ];


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

  describe('set object Param', () => {
    // it('should delete a noun', () => {

    //     const targetContextPack: ContextPack = component.contextpack;
    //     const targetId: string = targetContextPack._id;
    //     contextpackService.updateWordList(targetContextPack, targetContextPack.wordlists[0].name, null,null, {noun: 'goat'})
    //     .subscribe(
    //       contextpack => expect(contextpack).toBe(targetContextPack)
    //     );

    //     const expectedUrl: string = contextpackService.contextpackUrl + '/' + targetId +
    //     `/editlist?listname=${targetContextPack.wordlists[0].name}&delnoun=goat`;
    //     const req = httpTestingController.expectOne(expectedUrl);
    //     expect(req.request.method).toEqual('POST');
    //     req.flush(targetContextPack);

    // });
    it('set the object param for nouns', () => {
      const word = 'goat';
      const wordType = 'noun';
     expect(component.createParamObj(wordType, word)).toEqual({noun:'goat'});

    });
    it('set the object param for adjectives', () => {
      const word = 'goat';
      const wordType = 'adjective';
     expect(component.createParamObj(wordType, word)).toEqual({adjective:'goat'});

    });
    it('set the object param for verbs', () => {
      const word = 'goat';
      const wordType = 'verb';
     expect(component.createParamObj(wordType, word)).toEqual({verb:'goat'});

    });
    it('set the object param for misc', () => {
      const word = 'goat';
      const wordType = 'misc';
     expect(component.createParamObj(wordType, word)).toEqual({misc:'goat'});

    });
  });
});
