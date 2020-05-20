import { Component, Inject } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

interface ConfirmationDialogData {
  title?: string;
  contentText?: string;
  primaryColor?: ThemePalette;
}

@Component({
  selector: 'eko-confirmation-dialog',
  template: `
    <h2 mat-dialog-title>{{ title }}</h2>
    <mat-dialog-content class="mat-typography"
      >{{ contentText }}
      <ng-content></ng-content>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close withGtmContext [gtmData]="gtmDialogData">
        Nie
      </button>
      <button
        mat-button
        [color]="confirmationButtonColor"
        [mat-dialog-close]="true"
        withGtmContext
        [gtmData]="gtmDialogData"
      >
        Tak
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      mat-dialog-content {
        line-height: 24px;
        font-size: 16px;
        white-space: pre-wrap;
        padding-bottom: 10px;
      }

      .mat-dialog-actions {
        padding: 10px 0;
      }
    `,
  ],
})
export class ConfirmationDialog {
  title = this.data.title || 'Potwierdź akcję';
  contentText = this.data.contentText || 'Czy jesteś pewien, że chcesz wykonać tę akcję?';
  confirmationButtonColor = this.data.primaryColor || 'primary';
  gtmDialogData = { dialogTitle: this.title };

  constructor(@Inject(MAT_DIALOG_DATA) private data: ConfirmationDialogData = {}) {}

  static show(dialog: MatDialog, data: ConfirmationDialogData = {}) {
    return dialog.open(ConfirmationDialog, { data }).afterClosed();
  }
}
