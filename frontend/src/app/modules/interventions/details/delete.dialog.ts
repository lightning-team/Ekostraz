import { Component } from '@angular/core';

@Component({
    selector: 'app-delete-intervention-dialog',
    template: `
        <h2 mat-dialog-title>Usuń zgłoszenie</h2>
        <mat-dialog-content class="mat-typography">
            Czy jesteś pewien, że chcesz usunąć to zgłoszenie?
        </mat-dialog-content>
        <mat-dialog-actions align="end">
            <button mat-button mat-dialog-close cdkFocusInitial>Nie</button>
            <button mat-button [mat-dialog-close]="true">Tak</button>
        </mat-dialog-actions>
    `,
})
export class DeleteDialog { }
