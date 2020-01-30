import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterExtensionsService } from './router-extensions.service';

describe('RouterExtensionsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [RouterExtensionsService],
    }),
  );

  it('should be created', () => {
    const service: RouterExtensionsService = TestBed.get(RouterExtensionsService);
    expect(service).toBeTruthy();
  });
});
