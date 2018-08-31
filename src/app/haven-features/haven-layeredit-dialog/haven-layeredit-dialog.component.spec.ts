import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HavenLayerEditDialogComponent } from './haven-layeredit-dialog.component';

describe('HavenLayereditDialogComponent', () => {
  let component: HavenLayerEditDialogComponent;
  let fixture: ComponentFixture<HavenLayerEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HavenLayerEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HavenLayerEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
