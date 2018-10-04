import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HavenLoadingDialogComponent } from './haven-loading-dialog.component';

describe('HavenDialogComponent', () => {
  let component: HavenLoadingDialogComponent;
  let fixture: ComponentFixture<HavenLoadingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HavenLoadingDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HavenLoadingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
