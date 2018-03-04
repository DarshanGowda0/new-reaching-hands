import { TestBed, async, inject } from '@angular/core/testing';

import { CanAccessGuard } from './can-access.guard';

describe('CanAccessGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanAccessGuard]
    });
  });

  it('should ...', inject([CanAccessGuard], (guard: CanAccessGuard) => {
    expect(guard).toBeTruthy();
  }));
});
