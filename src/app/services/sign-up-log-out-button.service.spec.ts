import { TestBed } from '@angular/core/testing';

import { SignUpLogOutButtonService } from './sign-up-log-out-button.service';

describe('SignUpLogOutButtonService', () => {
  let service: SignUpLogOutButtonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignUpLogOutButtonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
