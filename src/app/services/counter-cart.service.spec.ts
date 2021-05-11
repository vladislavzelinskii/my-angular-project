import { TestBed } from '@angular/core/testing';

import { CounterCartService } from './counter-cart.service';

describe('CounterCartService', () => {
  let service: CounterCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CounterCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
