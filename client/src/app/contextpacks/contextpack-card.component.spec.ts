import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ContextPackCardComponent } from './contextpack-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { Word } from './contextpack';

describe('ContextPackCardComponent', () => {

  let component: ContextPackCardComponent;
  let fixture: ComponentFixture<ContextPackCardComponent>;

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

    component = fixture.componentInstance;

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

    component.contextpack = {
      _id: 'pat_id',
      enabled: false,
      name: 'happy',
      wordlists: null
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Note this takes in 0 as a num input so the test doesn't actually download the json file
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
