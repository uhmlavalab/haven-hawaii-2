import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HavenSidebarScenariosComponent } from './haven-sidebar-scenarios.component';

describe('HavenSidebarAccountComponent', () => {
  let component: HavenSidebarScenariosComponent;
  let fixture: ComponentFixture<HavenSidebarScenariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HavenSidebarScenariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HavenSidebarScenariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
