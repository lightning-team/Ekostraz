import { TestBed, async, inject } from '@angular/core/testing';

import { LoggedInMemberGuard } from './logged-in-member.guard';

describe('LoggedInMemberGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggedInMemberGuard]
    });
  });

  it('should ...', inject([LoggedInMemberGuard], (guard: LoggedInMemberGuard) => {
    expect(guard).toBeTruthy();
  }));
});
