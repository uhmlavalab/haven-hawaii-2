import { TestBed, inject } from '@angular/core/testing';

import { PlotlyFirestoreQueryService } from './plotly-firestore-query.service';

describe('PlotlyFirestoreQueryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlotlyFirestoreQueryService]
    });
  });

  it('should be created', inject([PlotlyFirestoreQueryService], (service: PlotlyFirestoreQueryService) => {
    expect(service).toBeTruthy();
  }));
});
