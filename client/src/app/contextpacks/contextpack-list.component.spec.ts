import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { Observable, of } from 'rxjs';
import { MockContextPackService } from '../../testing/contextpack.service.mock';
import { ContextPack } from './contextpack';
import { ContextPackCardComponent } from './contextpack-card.component';
import { ContextPackListComponent } from './contextpack-list.component';
import { ContextPackService } from './contextpack.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';


const COMMON_IMPORTS: any[] = [
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatSnackBarModule,
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
  FormsModule,
  ReactiveFormsModule,
];

describe('ContextPack list', () => {

  let contextpackList: ContextPackListComponent;
  let fixture: ComponentFixture<ContextPackListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [ContextPackListComponent, ContextPackCardComponent],

      providers: [{ provide: ContextPackService, useValue: new MockContextPackService() }]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ContextPackListComponent);
      contextpackList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('contains all the ContextPacks', () => {
    expect(contextpackList.serverFilteredContextpacks.length).toBe(3);
  });

  it('contains a ContextPack named \'fun\'', () => {
    expect(contextpackList.serverFilteredContextpacks.some((contextpack: ContextPack) => contextpack.name === 'fun')).toBe(true);
  });

  it('contain a ContextPack named \'happy\'', () => {
    expect(contextpackList.serverFilteredContextpacks.some((contextpack: ContextPack) => contextpack.name === 'happy')).toBe(true);
  });

  it('doesn\'t contain a contextpack named \'Santa\'', () => {
    expect(contextpackList.serverFilteredContextpacks.some((contextpack: ContextPack) => contextpack.name === 'Santa')).toBe(false);
  });
});

describe('Misbehaving ContextPack List', () => {
  let contextpackList: ContextPackListComponent;
  let fixture: ComponentFixture<ContextPackListComponent>;

  let getContextPacksSub: {
    getContextPacks: () => Observable<ContextPack[]>;
    getContextPacksFiltered: () => Observable<ContextPack[]>;
  };

  beforeEach(() => {
    // stub ContextPackService for test purposes
    getContextPacksSub = {
      getContextPacks: () => new Observable(observer => {
        observer.error('Error-prone observable');
      }),
      getContextPacksFiltered: () => new Observable(observer => {
        observer.error('Error-prone observable');
      })
    };

    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [ContextPackListComponent],
      // providers:    [ ContextPackService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{ provide: ContextPackService, useValue: getContextPacksSub }]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ContextPackListComponent);
      contextpackList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('generates an error if we don\'t set up a WordlistListService', () => {
    // Since the observer throws an error, we don't expect contextpacks to be defined.
    expect(contextpackList.serverFilteredContextpacks).toBeUndefined();
  });

});
describe('ContextPackListComponent', () => {

  let contextpackService: ContextPackService;
  let packServiceSpy: jasmine.SpyObj<MockContextPackService>;
  let component: ContextPackListComponent;
  let fixture: ComponentFixture<ContextPackListComponent>;
  let spy: jasmine.SpyObj<ContextPackService>;

  beforeEach(waitForAsync(() => {
    spy = jasmine.createSpyObj('ContextPackService', ['updateContextPack','getContextPacks','filterContextPacks']);
    spy.getContextPacks.and.returnValue(of (MockContextPackService.testContextPacks));
    TestBed.configureTestingModule({
      imports: [
        COMMON_IMPORTS
      ],
      declarations: [ ContextPackListComponent, ContextPackCardComponent ],
      providers: [{ provide: ContextPackService, useValue: spy },
        ]
    })
    .compileComponents().catch(error => {
      expect(error).toBeNull();
    });
    contextpackService = TestBed.inject(ContextPackService);
    packServiceSpy = TestBed.inject(ContextPackService) as jasmine.SpyObj<ContextPackService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextPackListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
  it('should update fields by correctly calling the context pack service', () => {
    spy.updateContextPack.and.returnValue(of(MockContextPackService.testContextPacks[0]));
    component.updateField(MockContextPackService.testContextPacks[1],['fun','name']);
    expect(spy.updateContextPack).toHaveBeenCalledTimes(1);
    component.updateField(MockContextPackService.testContextPacks[0],['false','enabled']);
    expect(spy.updateContextPack).toHaveBeenCalledTimes(2);
    component.updateField(MockContextPackService.testContextPacks[0],['test','icon']);
    expect(spy.updateContextPack).toHaveBeenCalledTimes(3);
  });




});

