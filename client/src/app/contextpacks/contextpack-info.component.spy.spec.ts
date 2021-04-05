import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ActivatedRouteStub } from '../../testing/activated-route-stub';
import { MockContextPackService } from '../../testing/contextpack.service.mock';
import { ContextPack } from './contextpack';
import { ContextPackCardComponent } from './contextpack-card.component';
import { ContextPackInfoComponent } from './contextpack-info.component';
import { ContextPackService } from './contextpack.service';

describe('updateField()', () => {
  let component: ContextPackInfoComponent;
  let fixture: ComponentFixture<ContextPackInfoComponent>;
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();
  let spy: jasmine.SpyObj<ContextPackService>;
  let contextpackService: ContextPackService;
  let packServiceSpy: jasmine.SpyObj<MockContextPackService>;

  beforeEach(waitForAsync(() => {
    spy = jasmine.createSpyObj('ContextPackService', [ 'updateContextPack','getContextPackById']);
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
        { provide: ContextPackService, useValue: spy },

      ]
    })
      .compileComponents();
    contextpackService = TestBed.inject(ContextPackService);
    packServiceSpy = TestBed.inject(ContextPackService) as jasmine.SpyObj<ContextPackService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextPackInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('calls contextpackservice.updateWordlist with correct parameters', () => {
    // Function should not be called to begin with
    expect(spy.updateContextPack).toHaveBeenCalledTimes(0);
    spy.updateContextPack.and.returnValue(of(MockContextPackService.testContextPacks[0]));
    spy.getContextPackById.and.returnValue(of(MockContextPackService.testContextPacks[0]));
    // //Calling updateField() in info component should call updateContextPack in service
    // component.updateField(MockContextPackService.testContextPacks[1],['name','name']);
    // expect(spy.updateContextPack).toHaveBeenCalledTimes(1);
    // component.updateField(component.contextpack,['enabled','enabled']);
    // expect(spy.updateContextPack).toHaveBeenCalledTimes(2);
    // component.updateField(component.contextpack,['icon','icon']);
    // expect(spy.updateContextPack).toHaveBeenCalledTimes(3);
  });

});
