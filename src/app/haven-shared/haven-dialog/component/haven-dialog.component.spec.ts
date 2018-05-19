import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HavenDialogComponent } from './haven-dialog.component';

describe('HavenDialogComponent', () => {
  let component: HavenDialogComponent;
  let fixture: ComponentFixture<HavenDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HavenDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HavenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
