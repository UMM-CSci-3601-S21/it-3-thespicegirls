import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ActivatedRouteStub } from '../../testing/activated-route-stub';
import { MockContextPackService } from '../../testing/contextpack.service.mock';
import { ContextPack, Word, Wordlist } from './contextpack';
import { ContextPackCardComponent } from './contextpack-card.component';
import { ContextPackInfoComponent } from './contextpack-info.component';
import { ContextPackService } from './contextpack.service';


describe('ContextPackInfoComponent', () => {
  let component: ContextPackInfoComponent;
  let fixture: ComponentFixture<ContextPackInfoComponent>;
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatCardModule,
        MatSnackBarModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [ContextPackInfoComponent, ContextPackCardComponent],
      providers: [
        { provide: ContextPackService, useValue: new MockContextPackService() },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
      .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(ContextPackInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to a specific contextpack info page', () => {
    const expectedContextPack: ContextPack = MockContextPackService.testContextPacks[0];
    // Setting this should cause anyone subscribing to the paramMap
    // to update. Our `ContextPackInfoComponent` subscribes to that, so
    // it should update right away.
    activatedRoute.setParamMap({ id: expectedContextPack._id });

    expect(component.id).toEqual(expectedContextPack._id);
    expect(component.contextpack).toEqual(expectedContextPack);
  });

  it('should navigate to correct contextpack when the id parameter changes', () => {
    let expectedContextPack: ContextPack = MockContextPackService.testContextPacks[0];
    // Setting this should cause anyone subscribing to the paramMap
    // to update. Our `ContextPackInfoComponent` subscribes to that, so
    // it should update right away.
    activatedRoute.setParamMap({ id: expectedContextPack._id });

    expect(component.id).toEqual(expectedContextPack._id);

    // Changing the paramMap should update the displayed contextpack's info.
    expectedContextPack = MockContextPackService.testContextPacks[1];
    activatedRoute.setParamMap({ id: expectedContextPack._id });

    expect(component.id).toEqual(expectedContextPack._id);
  });

  it('should have `null` for the contextpack for a bad ID', () => {
    activatedRoute.setParamMap({ id: 'badID' });

    // If the given ID doesn't map to a contextpack, we expect the service
    // to return `null`, so we would expect the component's contextpack
    // to also be `null`.
    expect(component.id).toEqual('badID');
    expect(component.contextpack).toBeNull();
  });


});

describe('editField()', () => {
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();
  let component: ContextPackInfoComponent;
  let fixture: ComponentFixture<ContextPackInfoComponent>;
  let contextpackService: ContextPackService;
  let packServiceSpy: jasmine.SpyObj<MockContextPackService>;

  let spy: jasmine.SpyObj<ContextPackService>;

  beforeEach(waitForAsync(() => {
    spy = jasmine.createSpyObj('ContextPackService', ['deleteWord', 'updateContextPack','updateWordList', 'checkIfAdmin']);
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatCardModule,
        MatSnackBarModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      declarations: [ ContextPackInfoComponent,ContextPackCardComponent ],
      providers: [{ provide: ContextPackService, useValue: spy },{ provide: ActivatedRoute, useValue: activatedRoute }
        ]
    })
    .compileComponents().catch(error => {
      expect(error).toBeNull();
    });
    contextpackService = TestBed.inject(ContextPackService);
    packServiceSpy = TestBed.inject(ContextPackService) as jasmine.SpyObj<ContextPackService>;
  }));



  beforeEach(() => {
    fixture = TestBed.createComponent(ContextPackInfoComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(ContextPackInfoComponent);


    component = fixture.componentInstance;

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
  ;

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

  it('calls contextpackservice.updateContextPack with correct parameters', () => {
    expect(spy.updateContextPack).toHaveBeenCalledTimes(0);
    spy.updateContextPack.and.returnValue(of(MockContextPackService.testContextPacks[0]));
    component.updateField(component.contextpack, ['name', 'name']);
    expect(spy.updateContextPack).toHaveBeenCalledTimes(1);
    component.updateField(component.contextpack, ['name', 'enabled']);
    expect(spy.updateContextPack).toHaveBeenCalledTimes(2);
    component.updateField(component.contextpack, ['name', 'icon']);
    expect(spy.updateContextPack).toHaveBeenCalledTimes(3);
  });

  describe('editField()', () => {
    it('calls contextpackservice.updateWordlist with correct parameters', () => {
      expect(spy.updateWordList).toHaveBeenCalledTimes(0);
      spy.updateWordList.and.returnValue(of(MockContextPackService.testContextPacks[0]));
      component.editField(component.contextpack.wordlists[0].name,'test','name');
      expect(spy.updateWordList).toHaveBeenCalledTimes(1);
      component.editField(component.contextpack.wordlists[0].name,'test','enabled');
      expect(spy.updateWordList).toHaveBeenCalledTimes(2);
    });
    it('calls correct snackbar message when word is added', () => {});

    it('calls correct snackbar message when word is not added', () => {});
  });

});



