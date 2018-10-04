import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HavenArMapComponent } from './haven-ar-map.component';

describe('HavenArMapComponent', () => {
  let component: HavenArMapComponent;
  let fixture: ComponentFixture<HavenArMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HavenArMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HavenArMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
