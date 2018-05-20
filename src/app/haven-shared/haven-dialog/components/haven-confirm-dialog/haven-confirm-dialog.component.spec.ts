import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HavenConfirmDialogComponent } from './haven-confirm-dialog.component';

describe('HavenConfirmDialogComponent', () => {
  let component: HavenConfirmDialogComponent;
  let fixture: ComponentFixture<HavenConfirmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HavenConfirmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HavenConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
