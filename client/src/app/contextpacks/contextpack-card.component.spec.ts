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
  let emptyWordlist: Wordlist;

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


    component = fixture.componentInstance;
    component2 = fixture2.componentInstance;

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
  {
      name: 'partner',
      enabled: true,
      nouns: testNouns,
      verbs: testVerbs,
      adjectives: testAdjectives,
      misc: testMisc
  }];

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

  it('should list the nouns, verbs, adjectives and misc words when displayWordlist() is called', () => {
    expect(component.displayWordlists(component.contextpack.wordlists[0])).toContain('you, yoyo, yos, yoted');
    expect(component.displayWordlists(component.contextpack.wordlists[0])).toContain('green, greener');
    expect(component.displayWordlists(component.contextpack.wordlists[0])).toContain('ran, running');
    expect(component.displayWordlists(component.contextpack.wordlists[0])).toContain('langerhans, langerhan');
    expect(component.displayWordlists(component.contextpack.wordlists[0])).not.toContain('barbie');
  });

  it('should return the nouns displayAllNouns() is called', () => {
    expect(component.displayAllWords(component.contextpack, 'nouns')).toContain('you, yoyo, yos, yoted, you, yoyo, yos, yoted');
  });
  it('should return the verbs when displayAllVerbs() is called', () => {
    expect(component.displayAllWords(component.contextpack, 'verbs')).toContain('ran, running, ran, running');
  });
  it('should return the adjectives when displayAllAdjectives() is called', () => {
    expect(component.displayAllWords(component.contextpack, 'adjectives')).toContain('green, greener, green, greener');
  });
  it('should return the misc words when displayAllMisc() is called', () => {
    expect(component.displayAllWords(component.contextpack, 'misc')).toContain('langerhans, langerhan, langerhans, langerhan');
  });


  it('should have displayNouns,verbs,adjective,misc return null if undefined', () => {
    expect(component.displayWords(emptyWordlist, 'nouns')).toBeNull();
    expect(component.displayWords(emptyWordlist, 'verbs')).toBeNull();
    expect(component.displayWords(emptyWordlist, 'adjectives')).toBeNull();
    expect(component.displayWords(emptyWordlist, 'misc')).toBeNull();
  });

  it('should have displayNouns,verbs,adjective,misc return null if undefined', () => {
    expect(component2.displayAllWords(component2.contextpack, 'nouns')).toBeNull();
    expect(component2.displayAllWords(component2.contextpack, 'verbs')).toBeNull();
    expect(component2.displayAllWords(component2.contextpack, 'adjectives')).toBeNull();
    expect(component2.displayAllWords(component2.contextpack, 'misc')).toBeNull();
  });

  it('should create a download element when given a json', () => {
    expect(component.downloadJson(component.contextpack, component.contextpack.name).toString()).toContain('happy');

  });
  it('should convert a json into a correctly formatted json', () => {
    expect(component.convertToBetterJson(component.contextpack).$schema).
    toEqual('https://raw.githubusercontent.com/kidstech/story-builder/master/Assets/packs/schema/pack.schema.json');
    expect(component.convertToBetterJson(component.contextpack).id).toBeUndefined();
  });
});
