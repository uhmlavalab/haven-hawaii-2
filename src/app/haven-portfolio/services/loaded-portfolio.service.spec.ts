import { TestBed, inject } from '@angular/core/testing';

import { LoadedPortfolioService } from './loaded-portfolio.service';

describe('LoadedPortfolioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadedPortfolioService]
    });
  });

  it('should be created', inject([LoadedPortfolioService], (service: LoadedPortfolioService) => {
    expect(service).toBeTruthy();
  }));
});
