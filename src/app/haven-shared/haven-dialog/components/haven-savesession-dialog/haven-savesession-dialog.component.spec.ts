import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HavenSavesessionDialogComponent } from './haven-savesession-dialog.component';

describe('HavenSavesessionDialogComponent', () => {
  let component: HavenSavesessionDialogComponent;
  let fixture: ComponentFixture<HavenSavesessionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HavenSavesessionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HavenSavesessionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
