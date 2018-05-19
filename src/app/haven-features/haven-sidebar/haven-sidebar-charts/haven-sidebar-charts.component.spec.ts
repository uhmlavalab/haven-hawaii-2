import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HavenSidebarChartsComponent } from './haven-sidebar-charts.component';

describe('HavenSidebarChartsComponent', () => {
  let component: HavenSidebarChartsComponent;
  let fixture: ComponentFixture<HavenSidebarChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HavenSidebarChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HavenSidebarChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
