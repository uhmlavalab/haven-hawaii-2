import { TestBed, inject } from '@angular/core/testing';

import { HavenDialogService } from './haven-dialog.service';

describe('HavenDialogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HavenDialogService]
    });
  });

  it('should be created', inject([HavenDialogService], (service: HavenDialogService) => {
    expect(service).toBeTruthy();
  }));
});
