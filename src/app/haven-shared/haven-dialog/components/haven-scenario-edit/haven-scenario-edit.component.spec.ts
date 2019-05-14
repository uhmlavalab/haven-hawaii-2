import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HavenScenarioEditComponent } from './haven-scenario-edit.component';

describe('HavenScenarioEditComponent', () => {
  let component: HavenScenarioEditComponent;
  let fixture: ComponentFixture<HavenScenarioEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HavenScenarioEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HavenScenarioEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
