import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environment';
import { InterventionStatus } from '@shared/domain/intervention.status';
import { InterventionFormData } from '@shared/domain/intervention.model';

import { InterventionFormService } from './intervention-form.service';

describe('InterventionFormService', () => {
  let service: InterventionFormService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let requestMock: TestRequest;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InterventionFormService],
    });

    service = TestBed.get(InterventionFormService);
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send correct data to the backend on post', () => {
    service.post(testFormData).subscribe();

    requestMock = httpTestingController.expectOne({ method: 'POST', url: expectedPostUrl });

    expect(requestMock.request.withCredentials).toEqual(false);
    expect(requestMock.request.body).toEqual(expectedRequestData);
  });

  it('should send correct data to the backend on update', () => {
    service.update(testFormData).subscribe();

    requestMock = httpTestingController.expectOne({ method: 'PUT', url: expectedPutUrl });

    expect(requestMock.request.withCredentials).toEqual(false);
    expect(requestMock.request.body).toEqual(expectedRequestData);
  });
});

const testFormData: InterventionFormData = {
  id: '1',
  creationDate: null,
  fullName: 'Test Name',
  description: 'Test description',
  phoneNumber: '12356789',
  email: 'test@ekostraz.pl',
  status: InterventionStatus.ToVerify,
  streetNumber: '15',
  city: 'New York',
  street: 'Wall street',
};

const expectedRequestData = testFormData;
const expectedPostUrl = `${environment.APIUrl}interventions`;
const expectedPutUrl = `${environment.APIUrl}interventions/${testFormData.id}`;
