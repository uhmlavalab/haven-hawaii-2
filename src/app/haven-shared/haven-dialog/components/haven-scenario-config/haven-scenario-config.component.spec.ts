import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HavenScenarioConfigComponent } from './haven-scenario-config.component';

describe('HavenScenarioConfigComponent', () => {
  let component: HavenScenarioConfigComponent;
  let fixture: ComponentFixture<HavenScenarioConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HavenScenarioConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HavenScenarioConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
