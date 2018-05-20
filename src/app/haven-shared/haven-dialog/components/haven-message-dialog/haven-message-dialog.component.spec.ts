import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HavenMessageDialogComponent } from './haven-message-dialog.component';

describe('HavenDialogComponent', () => {
  let component: HavenMessageDialogComponent;
  let fixture: ComponentFixture<HavenMessageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HavenMessageDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HavenMessageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
