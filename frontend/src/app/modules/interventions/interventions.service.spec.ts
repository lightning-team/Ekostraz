import { TestBed } from '@angular/core/testing';

import { InterventionsService } from './interventions.service';

describe('InterventionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InterventionsService = TestBed.get(InterventionsService);
    expect(service).toBeTruthy();
  });
});
