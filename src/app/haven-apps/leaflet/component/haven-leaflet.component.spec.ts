import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HavenLeafletComponent } from './haven-leaflet.component';

describe('HavenLeafletComponent', () => {
  let component: HavenLeafletComponent;
  let fixture: ComponentFixture<HavenLeafletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HavenLeafletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HavenLeafletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
