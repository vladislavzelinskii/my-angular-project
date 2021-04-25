import { TestBed } from '@angular/core/testing';

import { CompareCounterService } from './compare-counter.service';

describe('CompareCounterService', () => {
  let service: CompareCounterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompareCounterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
