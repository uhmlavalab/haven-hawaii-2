import { TestBed, inject } from '@angular/core/testing';

import { HavenLayerUploadService } from './haven-layer-upload.service';

describe('HavenLayerUploadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HavenLayerUploadService]
    });
  });

  it('should be created', inject([HavenLayerUploadService], (service: HavenLayerUploadService) => {
    expect(service).toBeTruthy();
  }));
});
