import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';

import {of} from 'rxjs';

import {PublicFormService} from './public-form.service';
import {InterventionStatus} from '@shared/intervention.status';
import {InterventionFormData, InterventionPostData} from '@interventionForm/types';


const POST_FORM_URL = 'https://devkodawanie.azurewebsites.net/api/AddPublicForm';

const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
const snackBarRefMock = {
    afterDismissed: jasmine.createSpy('afterDismissed').and.returnValue(of({}))
};
const snackBarMock = {
    open: jasmine.createSpy('open').and.returnValue(snackBarRefMock)
};

const SNACKBAR_CONFIG = {
    duration: 5000,
    verticalPosition: 'bottom',
    horizontalPosition: 'right',
};

function createTestFormData() {
    return {
        id: '0',
        date: null,
        name: 'Test Name',
        description: 'Test description',
        phone: '12356789',
        email: 'test@ekostraz.pl',
        status: InterventionStatus.ToVerify,
        address: {number: '15', city: 'New York', street: 'Wall street'},
    } as InterventionFormData;
}


fdescribe('PublicFormService', () => {
    let service: PublicFormService;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                PublicFormService,
                {provide: Router, useValue: routerSpy},
                {provide: MatSnackBar, useValue: snackBarMock}
            ],
        });

        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        service = TestBed.get(PublicFormService);
    });

    afterEach(() => {
        httpClient = null;
        httpTestingController = null;
        service = null;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('postPublicForm', () => {
        it('should send correct data to the backend', () => {
            const formData = createTestFormData();
            const expectedRequestData = new InterventionPostData(formData);

            service.postPublicForm(formData);

            const requestMock = httpTestingController.expectOne(POST_FORM_URL);
            expect(requestMock.request.method).toEqual('POST');
            expect(requestMock.request.withCredentials).toEqual(false);
            expect(requestMock.request.body).toEqual(expectedRequestData);
        });

        it('should open snack bar on success and navigate to home page', () => {
            const expectedMessage = 'Twoje zgłoszenie zostało przyjęte!';

            service.postPublicForm(createTestFormData());

            const requestMock = httpTestingController.expectOne(POST_FORM_URL);
            requestMock.flush({});

            expect(snackBarRefMock.afterDismissed).toHaveBeenCalled();
            expect(snackBarMock.open).toHaveBeenCalledWith(expectedMessage, 'Zamknij', SNACKBAR_CONFIG);
            expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('');
        });

        fit('should open snack bar on error', () => {
            const expectedMessage = 'Niestety, nie udało się przyjąć Twojego zgłoszenia!';
            const errorEvent = new ErrorEvent('some error');

            service.postPublicForm(createTestFormData());

            const requestMock = httpTestingController.expectOne(POST_FORM_URL);
            requestMock.error(errorEvent);

            expect(snackBarMock.open).toHaveBeenCalledWith(expectedMessage, 'Zamknij', SNACKBAR_CONFIG);
        });
    });
});
