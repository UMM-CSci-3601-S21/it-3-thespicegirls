import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteStub } from '../../testing/activated-route-stub';
import { MockContextpackService } from '../../testing/contextpack.service.mock';
import { ContextPack } from './contextpack';
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
        MatCardModule
      ],
      declarations: [ContextPackInfoComponent, ContextPackCardComponent],
      providers: [
        { provide: ContextPackService, useValue: new MockContextpackService() },
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
    const expectedContextPack: ContextPack = MockContextpackService.testContextpacks[0];
    // Setting this should cause anyone subscribing to the paramMap
    // to update. Our `ContextPackInfoComponent` subscribes to that, so
    // it should update right away.
    activatedRoute.setParamMap({ id: expectedContextPack._id });

    expect(component.id).toEqual(expectedContextPack._id);
    expect(component.contextpack).toEqual(expectedContextPack);
  });

  it('should navigate to correct contextpack when the id parameter changes', () => {
    let expectedContextPack: ContextPack = MockContextpackService.testContextpacks[0];
    // Setting this should cause anyone subscribing to the paramMap
    // to update. Our `ContextPackInfoComponent` subscribes to that, so
    // it should update right away.
    activatedRoute.setParamMap({ id: expectedContextPack._id });

    expect(component.id).toEqual(expectedContextPack._id);

    // Changing the paramMap should update the displayed contextpack's info.
    expectedContextPack = MockContextpackService.testContextpacks[1];
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
