import { HttpRequest } from '@angular/common/http';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';

import { AzureTokenInterceptor } from '@shared/interceptors/azure-token.interceptor';

const specDescriptionForMethod = (method: string) => `should add x-functions-key header to ${method} request`;

describe('AzureTokenInterceptor', () => {
  let tokenInterceptor: AzureTokenInterceptor;
  let request: HttpRequest<any>;
  let returnedRequest: HttpRequest<any>;

  const httpHandlerMock = {
    handle: jasmine.createSpy().and.callFake(req => {
      returnedRequest = req;
      return of(req);
    }),
  };

  const intercept = async (req: HttpRequest<any> = request) =>
    await tokenInterceptor
      .intercept(req, httpHandlerMock)
      .pipe(first())
      .toPromise();

  const expectTokenHeader = () =>
    expect(returnedRequest.headers.get(FUNCTIONS_TOKEN_HEADER_KEY)).toEqual(MOCK_FUNCTIONS_TOKEN);

  beforeAll(() => {
    window.fetch = jasmine.createSpy('fetch');
  });

  beforeEach(() => {
    tokenInterceptor = new AzureTokenInterceptor();
    request = new HttpRequest('GET', 'some-url');
  });

  it('should clone request if response successful', async () => {
    await intercept();

    expect(returnedRequest).not.toBe(request);
  });

  ['GET', 'DELETE'].forEach((method: 'GET' | 'DELETE') => {
    it(specDescriptionForMethod(method), async () => {
      request = new HttpRequest(method, 'some-url');

      await intercept(request);

      expectTokenHeader();
    });
  });

  ['POST', 'PUT', 'PATCH'].forEach((method: 'POST' | 'PUT' | 'PATCH') => {
    it(specDescriptionForMethod(method), async () => {
      request = new HttpRequest(method, 'some-url', {});

      await intercept(request);

      expectTokenHeader();
    });
  });
});

const FUNCTIONS_TOKEN_HEADER_KEY = 'x-functions-key';
const MOCK_FUNCTIONS_TOKEN = 'test-functions-key';
