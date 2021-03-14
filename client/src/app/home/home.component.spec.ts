import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HomeComponent} from './home.component';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';

describe('Home', () => {

  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule],
      declarations: [HomeComponent], // declare the test component
    });

    fixture = TestBed.createComponent(HomeComponent);

    component = fixture.componentInstance; // BannerComponent test instance
  });

  it('It has the basic home page text', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
