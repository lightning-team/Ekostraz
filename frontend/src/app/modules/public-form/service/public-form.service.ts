import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';

import {Subscription} from 'rxjs';

import {InterventionFormData, InterventionPostData} from '@interventionForm/types';

// TODO: There is a lot of copy-pastes from Interventions service.
// Try to generalize it to a common logic in the future.
const BASE_API_URL = 'https://devkodawanie.azurewebsites.net/api/';
const AddPublicFormUrl = BASE_API_URL + 'AddPublicForm';

const HTTP_OPTIONS = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable()
export class PublicFormService {
    constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) {}

    private postForm(formData: InterventionFormData, APIUrl: string): Subscription {
        return this.http.post(APIUrl, new InterventionPostData(formData), HTTP_OPTIONS)
            .subscribe({
                next: this.onPostSuccess.bind(this),
                error: this.onPostError.bind(this)
            });
    }

    postPublicForm(formData: InterventionFormData): Subscription {
        return this.postForm(formData, AddPublicFormUrl);
    }

    private onPostSuccess() {
        this.openSnackBar('Dziękujemy! Twoje zgłoszenie zostało przyjęte!');
        this.router.navigateByUrl('');
    }

    private onPostError() {
        this.openSnackBar('Niestety, nie udało się przyjąć Twojego zgłoszenia!');
    }

    private openSnackBar(message: string) {
        return this.snackBar.open(message, 'Zamknij', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
        });
    }
}
