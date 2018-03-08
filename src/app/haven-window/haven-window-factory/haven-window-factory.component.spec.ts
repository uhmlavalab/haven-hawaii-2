import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HavenWindowFactoryComponent } from './haven-window-factory.component';

describe('HavenWindowFactoryComponent', () => {
  let component: HavenWindowFactoryComponent;
  let fixture: ComponentFixture<HavenWindowFactoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HavenWindowFactoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HavenWindowFactoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
