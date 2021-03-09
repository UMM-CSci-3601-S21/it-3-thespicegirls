import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteStub } from '../../testing/activated-route-stub';
import { MockWordlistService } from '../../testing/contextpack.service.mock';
import { Wordlist } from './contextpack';
import { WordlistCardComponent } from './contextpack-card.component';
import { WordlistInfoComponent } from './contextpack-info.component';
import { WordlistService } from './contextpack.service';

describe('WordlistInfoComponent', () => {
  let component: WordlistInfoComponent;
  let fixture: ComponentFixture<WordlistInfoComponent>;
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatCardModule
      ],
      declarations: [WordlistInfoComponent, WordlistCardComponent],
      providers: [
        { provide: WordlistService, useValue: new MockWordlistService() },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordlistInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to a specific wordlist info page', () => {
    const expectedWordlist: Wordlist = MockWordlistService.testWordlists[0];
    // Setting this should cause anyone subscribing to the paramMap
    // to update. Our `WordlistInfoComponent` subscribes to that, so
    // it should update right away.
    activatedRoute.setParamMap({ id: expectedWordlist._id });

    expect(component.id).toEqual(expectedWordlist._id);
    expect(component.wordlist).toEqual(expectedWordlist);
  });

  it('should navigate to correct wordlist when the id parameter changes', () => {
    let expectedWordlist: Wordlist = MockWordlistService.testWordlists[0];
    // Setting this should cause anyone subscribing to the paramMap
    // to update. Our `WordlistInfoComponent` subscribes to that, so
    // it should update right away.
    activatedRoute.setParamMap({ id: expectedWordlist._id });

    expect(component.id).toEqual(expectedWordlist._id);

    // Changing the paramMap should update the displayed wordlist's info.
    expectedWordlist = MockWordlistService.testWordlists[1];
    activatedRoute.setParamMap({ id: expectedWordlist._id });

    expect(component.id).toEqual(expectedWordlist._id);
  });

  it('should have `null` for the wordlist for a bad ID', () => {
    activatedRoute.setParamMap({ id: 'badID' });

    // If the given ID doesn't map to a wordlist, we expect the service
    // to return `null`, so we would expect the component's wordlist
    // to also be `null`.
    expect(component.id).toEqual('badID');
    expect(component.wordlist).toBeNull();
  });
});
