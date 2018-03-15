import { TestBed, inject } from '@angular/core/testing';

import { HavenWindowService } from './haven-window.service';

describe('HavenWindowServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HavenWindowService]
    });
  });

  it('should be created', inject([HavenWindowService], (service: HavenWindowService) => {
    expect(service).toBeTruthy();
  }));
});
