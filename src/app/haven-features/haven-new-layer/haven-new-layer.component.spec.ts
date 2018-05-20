import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HavenNewLayerComponent } from './haven-new-layer.component';

describe('HavenNewLayerComponent', () => {
  let component: HavenNewLayerComponent;
  let fixture: ComponentFixture<HavenNewLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HavenNewLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HavenNewLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
