import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HavenLoginComponent } from './haven-login.component';

describe('HavenLoginComponent', () => {
  let component: HavenLoginComponent;
  let fixture: ComponentFixture<HavenLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HavenLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HavenLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
