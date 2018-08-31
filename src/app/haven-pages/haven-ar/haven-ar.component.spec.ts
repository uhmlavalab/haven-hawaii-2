import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HavenArComponent } from './haven-ar.component';

describe('HavenArComponent', () => {
  let component: HavenArComponent;
  let fixture: ComponentFixture<HavenArComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HavenArComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HavenArComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
