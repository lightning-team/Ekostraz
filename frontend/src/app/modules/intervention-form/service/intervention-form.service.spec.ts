import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { InterventionFormService } from './intervention-form.service';
import { InterventionStatus } from '@shared/domain/intervention.status';
import { InterventionFormData, InterventionPostData } from '@interventionForm/types';
import { environment } from '@environment';

const testFormData: InterventionFormData = {
  id: '0',
  date: null,
  name: 'Test Name',
  description: 'Test description',
  phone: '12356789',
  email: 'test@ekostraz.pl',
  status: InterventionStatus.ToVerify,
  address: { number: '15', city: 'New York', street: 'Wall street' },
};

const expectedRequestData = new InterventionPostData(testFormData);
const expectedPostUrl = `${environment.APIUrl}interventions`;

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

  it('should send correct data to the backend', () => {
    service.post(testFormData).subscribe();

    requestMock = httpTestingController.expectOne({ method: 'POST', url: expectedPostUrl });

    expect(requestMock.request.withCredentials).toEqual(false);
    expect(requestMock.request.body).toEqual(expectedRequestData);
  });
});
