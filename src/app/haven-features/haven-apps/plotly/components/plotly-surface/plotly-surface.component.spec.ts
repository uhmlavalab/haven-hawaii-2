import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotlySurfaceComponent } from './plotly-surface.component';

describe('PlotlySurfaceComponent', () => {
  let component: PlotlySurfaceComponent;
  let fixture: ComponentFixture<PlotlySurfaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlotlySurfaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlotlySurfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
