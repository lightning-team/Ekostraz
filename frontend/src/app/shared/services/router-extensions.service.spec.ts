import { TestBed } from '@angular/core/testing';

import { RouterExtensionsService } from './router-extensions.service';

describe('RouterExtensionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  xit('should be created', () => {
    const service: RouterExtensionsService = TestBed.get(RouterExtensionsService);
    expect(service).toBeTruthy();
  });
});
