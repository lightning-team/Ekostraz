import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { InterventionFormService } from './intervention-form.service';
import { InterventionStatus } from '@shared/domain/intervention.status';
import { InterventionFormData, InterventionPostData } from '@interventionForm/types';

const POST_FORM_URL = 'https://devkodawanie.azurewebsites.net/api/AddPublicForm';

const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
const snackBarMock = {
  open: jasmine.createSpy('open'),
};
const SNACK_BAR_META = {
  action: 'Zamknij',
  config: {
    duration: 5000,
    verticalPosition: 'top',
    horizontalPosition: 'center',
  },
};

const expectSnackBarOpened = (message: string) =>
  expect(snackBarMock.open).toHaveBeenCalledWith(message, SNACK_BAR_META.action, SNACK_BAR_META.config);

const createTestFormData = () =>
  ({
    id: '0',
    date: null,
    name: 'Test Name',
    description: 'Test description',
    phone: '12356789',
    email: 'test@ekostraz.pl',
    status: InterventionStatus.ToVerify,
    address: { number: '15', city: 'New York', street: 'Wall street' },
  } as InterventionFormData);

describe('PublicFormService', () => {
  let service: InterventionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        InterventionFormService,
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarMock },
      ],
    });

    service = TestBed.get(InterventionFormService);
  });

  afterEach(() => {
    service = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('postPublicForm', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let requestMock: TestRequest;

    beforeEach(() => {
      httpClient = TestBed.get(HttpClient);
      httpTestingController = TestBed.get(HttpTestingController);

      spyOn(Date.prototype, 'toISOString').and.returnValue('2019-07-30T11:34:07.791Z');

      service.post(createTestFormData(), '');
      requestMock = httpTestingController.expectOne(POST_FORM_URL);
    });

    afterEach(() => {
      httpClient = null;
      httpTestingController = null;
      requestMock = null;
    });

    it('should send correct data to the backend', () => {
      const expectedRequestData = new InterventionPostData(createTestFormData());

      expect(requestMock.request.method).toEqual('POST');
      expect(requestMock.request.withCredentials).toEqual(false);
      expect(requestMock.request.body).toEqual(expectedRequestData);
    });

    it('should open snack bar on success and navigate to home page', () => {
      const expectedMessage = 'Dziękujemy! Twoje zgłoszenie zostało przyjęte!';

      requestMock.flush({});

      expectSnackBarOpened(expectedMessage);
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('');
    });

    it('should open snack bar on error', () => {
      const expectedMessage = 'Niestety, nie udało się przyjąć Twojego zgłoszenia!';
      const errorEvent = new ErrorEvent('some error');

      requestMock.error(errorEvent);

      expectSnackBarOpened(expectedMessage);
    });
  });
});
