import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HavenSidebarAccountComponent } from './haven-sidebar-account.component';

describe('HavenSidebarAccountComponent', () => {
  let component: HavenSidebarAccountComponent;
  let fixture: ComponentFixture<HavenSidebarAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HavenSidebarAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HavenSidebarAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
