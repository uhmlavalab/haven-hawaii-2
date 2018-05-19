import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HavenHomeComponent } from './haven-home.component';

describe('HavenHomeComponent', () => {
  let component: HavenHomeComponent;
  let fixture: ComponentFixture<HavenHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HavenHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HavenHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
