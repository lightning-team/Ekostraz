import { Component } from '@angular/core';

@Component({
    selector: 'app-delete-intervention-dialog',
    template: `
        <h2 mat-dialog-title>{{title}}</h2>
        <mat-dialog-content class="mat-typography">
            Czy jesteś pewien, że chcesz usunąć to zgłoszenie?
        </mat-dialog-content>
        <mat-dialog-actions align="end">
            <button mat-button mat-dialog-close cdkFocusInitial withGtmContext [gtmData]="gtmDialogData">Nie</button>
            <button mat-button [mat-dialog-close]="true" withGtmContext [gtmData]="gtmDialogData">Tak</button>
        </mat-dialog-actions>
    `,
})
export class DeleteDialog {
    title = 'Usuń zgłoszenie';
    gtmDialogData = {dialogTitle: this.title};
}
