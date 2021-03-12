import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ContextPackCardComponent } from './contextpack-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { Word, Wordlist } from './contextpack';


describe('ContextPackCardComponent', () => {

  let component: ContextPackCardComponent;
  let fixture: ComponentFixture<ContextPackCardComponent>;
  let component2: ContextPackCardComponent;
  let fixture2: ComponentFixture<ContextPackCardComponent>;
  let component3: ContextPackCardComponent;
  let fixture3: ComponentFixture<ContextPackCardComponent>;
  let wordlist: Wordlist;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatCardModule
      ],
      declarations: [ ContextPackCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextPackCardComponent);
    fixture2 = TestBed.createComponent(ContextPackCardComponent);
    fixture3 = TestBed.createComponent(ContextPackCardComponent);


    component = fixture.componentInstance;
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
      forms: ['langerhans', 'langerhan']
    };
    const testNouns: Word[] = [noun];
    const testVerbs: Word[] = [verb];
    const testAdjectives: Word[] = [adjective];
    const testMisc: Word[] = [misc];
    const testWordList: Wordlist[] = [{
      name: 'howdy',
      enabled: true,
      nouns: testNouns,
      verbs: testVerbs,
      adjectives: testAdjectives,
      misc: testMisc
    }];
    const testWordListBig: Wordlist[] = [{
      name: 'howdy',
      enabled: true,
      nouns: testNouns,
      verbs: testVerbs,
      adjectives: testAdjectives,
      misc: testMisc
    },
  {
      name: 'partner',
      enabled: true,
      nouns: testNouns,
      verbs: testVerbs,
      adjectives: testAdjectives,
      misc: testMisc
  }];
    wordlist = {

    };

    component.contextpack = {
      _id: 'pat_id',
      enabled: true,
      name: 'happy',
      wordlists: testWordList
    };
    component2.contextpack = {
      _id: 'mat_id',
      enabled: true,
      name: 'Joy',
    };
    component3.contextpack = {
      _id: 'kat_id',
      enabled: true,
      name: 'Franz',
      wordlists: testWordListBig
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list the nouns, verbs, adjectives and misc words when displayWordlist() is called', () => {
    expect(component.displayWordlists(component.contextpack.wordlists[0])).toContain('you, yoyo, yos, yoted');
    expect(component.displayWordlists(component.contextpack.wordlists[0])).toContain('green, greener');
    expect(component.displayWordlists(component.contextpack.wordlists[0])).toContain('ran, running');
    expect(component.displayWordlists(component.contextpack.wordlists[0])).toContain('langerhans, langerhan');
    expect(component.displayWordlists(component.contextpack.wordlists[0])).not.toContain('barbie');
  });

  it('should return the nouns displayAllNouns() is called', () => {
    expect(component.displayAllNouns(component.contextpack)).toContain('you, yoyo, yos, yoted');
  });
  it('should return the verbs when displayAllVerbs() is called', () => {
    expect(component.displayAllVerbs(component.contextpack)).toContain('ran, running');
  });
  it('should return the adjectives when displayAllAdjectives() is called', () => {
    expect(component.displayAllAdjectives(component.contextpack)).toContain('green, greener');
  });
  it('should return the misc words when displayAllMisc() is called', () => {
    expect(component.displayAllMisc(component.contextpack)).toContain('langerhans, langerhan');
  });


  it('should have displayNouns,ver,adjective,misc return null if undefined', () => {
    expect(component.displayNouns(wordlist)).toBeNull();
    expect(component.displayVerbs(wordlist)).toBeNull();
    expect(component.displayAdjectives(wordlist)).toBeNull();
    expect(component.displayMisc(wordlist)).toBeNull();
  });

  it('should have displayNouns,ver,adjective,misc return null if undefined', () => {
    expect(component2.displayAllNouns(component2.contextpack)).toBeNull();
    expect(component2.displayAllVerbs(component2.contextpack)).toBeNull();
    expect(component2.displayAllAdjectives(component2.contextpack)).toBeNull();
    expect(component2.displayAllMisc(component2.contextpack)).toBeNull();
  });

  /**
   * Note this takes in 0 as a num input so the test doesn't actually download the json file only checks the element
   */
  it('should create a download element when given a json', () => {
    expect(component.downloadJson(component.contextpack, component.contextpack.name, 0).toString()).toContain('happy');
  });
  it('should convert a json into a correctly formatted json', () => {
    expect(component.convertToBetterJson(component.contextpack).$schema).
    toEqual('https://raw.githubusercontent.com/kidstech/story-builder/master/Assets/packs/schema/pack.schema.json');
    expect(component.convertToBetterJson(component.contextpack).id).toBeUndefined();
  });
});
