import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HavenSidebarMapsComponent } from './haven-sidebar-maps.component';

describe('HavenSidebarMapsComponent', () => {
  let component: HavenSidebarMapsComponent;
  let fixture: ComponentFixture<HavenSidebarMapsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HavenSidebarMapsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HavenSidebarMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
