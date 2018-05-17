import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotlyScatterComponent } from './plotly-scatter.component';

describe('PlotlyScatterComponent', () => {
  let component: PlotlyScatterComponent;
  let fixture: ComponentFixture<PlotlyScatterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlotlyScatterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlotlyScatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
