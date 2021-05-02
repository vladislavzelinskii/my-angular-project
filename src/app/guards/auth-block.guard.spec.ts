import { TestBed } from '@angular/core/testing';

import { AuthBlockGuard } from './auth-block.guard';

describe('AuthBlockGuard', () => {
  let guard: AuthBlockGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthBlockGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
