import { TestBed, async, inject } from '@angular/core/testing';

import { LoggedInUserGuard } from './logged-in-user.guard';

describe('LoggedInUserGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggedInUserGuard]
    });
  });

  it('should ...', inject([LoggedInUserGuard], (guard: LoggedInUserGuard) => {
    expect(guard).toBeTruthy();
  }));
});
