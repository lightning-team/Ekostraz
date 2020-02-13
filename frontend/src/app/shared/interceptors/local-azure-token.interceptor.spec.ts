import { HttpRequest } from '@angular/common/http';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';
import { LocalAzureTokenInterceptor } from '@shared/interceptors/local-azure-token.interceptor';

const specDescriptionForMethod = (method: string) =>
  `should add x-functions-key header to ${method} request if token exists`;

describe('LocalAzureTokenInterceptor', () => {
  let tokenInterceptor: LocalAzureTokenInterceptor;
  let request: HttpRequest<any>;
  let returnedRequest: HttpRequest<any>;
  let fetchMock: jasmine.Spy;

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
    fetchMock = window.fetch as jasmine.Spy;
  });

  beforeEach(() => {
    tokenInterceptor = new LocalAzureTokenInterceptor();
    request = new HttpRequest('GET', 'some-url');
    fetchMock.and.returnValue(Promise.resolve(testFetchSecretsResponse));
  });

  it('should clone request if response successful and token exists', async () => {
    await intercept();

    expect(returnedRequest).not.toBe(request);
  });

  it('should not clone request if response successful but token does not exist', async () => {
    fetchMock.and.returnValue(Promise.resolve(testFetchNoTokenResponse));

    await intercept();

    expect(returnedRequest).toBe(request);
  });

  it('should not clone request if response not successful', async () => {
    fetchMock.and.returnValue(Promise.resolve(testFetchNotOkResponse));

    await intercept();

    expect(returnedRequest).toBe(request);
  });

  describe('window.fetch', () => {
    it('should be called with secrets file url', async () => {
      fetchMock.calls.reset();

      await intercept();

      expect(fetchMock).toHaveBeenCalledWith('local.secrets.json');
    });

    it('should not be called for localhost requests', async () => {
      fetchMock.calls.reset();

      await intercept(new HttpRequest('GET', 'localhost:8080/some-url'));

      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('should be called only once per interceptor instance', async () => {
      fetchMock.calls.reset();

      await intercept();
      await intercept();
      await intercept();

      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
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

const testFetchSecretsResponse = {
  ok: true,
  json: () =>
    Promise.resolve({
      azureFunctionsToken: MOCK_FUNCTIONS_TOKEN,
    }),
};

const testFetchNoTokenResponse = {
  ok: true,
  json: () =>
    Promise.resolve({
      someOtherToken: 'another',
    }),
};

const testFetchNotOkResponse = {
  ok: false,
};
