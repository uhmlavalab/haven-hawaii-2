import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HavenChartComponent } from './haven-chart.component';

describe('HavenChartComponent', () => {
  let component: HavenChartComponent;
  let fixture: ComponentFixture<HavenChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HavenChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HavenChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
