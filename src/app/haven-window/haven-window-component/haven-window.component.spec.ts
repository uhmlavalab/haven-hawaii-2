import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HavenWindowComponent } from './haven-window.component';

describe('HavenWindowComponentComponent', () => {
  let component: HavenWindowComponent;
  let fixture: ComponentFixture<HavenWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HavenWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HavenWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
