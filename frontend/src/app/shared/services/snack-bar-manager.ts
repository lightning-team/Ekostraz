import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { catchError, tap } from 'rxjs/operators';
import { pipe, throwError } from 'rxjs';

interface SnackBarConfig {
  duration?: number;
  verticalPosition?: MatSnackBarVerticalPosition;
  horizontalPosition?: MatSnackBarHorizontalPosition;
}

export interface SnackBarPipeConfig extends SnackBarConfig {
  successMsg: string;
  errorMsg: string;
  buttonText?: string;
}

const DEFAULT_BUTTON_TEXT = 'Zamknij';

const DEFAULT_CONFIG: SnackBarConfig = {
  duration: 5000,
  verticalPosition: 'top',
  horizontalPosition: 'center',
};

@Injectable({
  providedIn: 'root',
})
export class SnackBarManager {
  constructor(private snackBar: MatSnackBar) {}

  successFailurePipe(config: SnackBarPipeConfig) {
    const { successMsg, errorMsg, buttonText, ...snackBarConfig } = config;
    return pipe(
      tap(() => this.openSnackBar(successMsg, buttonText, snackBarConfig)),
      catchError(err => {
        this.openSnackBar(errorMsg, buttonText, snackBarConfig);
        return throwError(err);
      }),
    );
  }

  openSnackBar(message: string, buttonText: string = DEFAULT_BUTTON_TEXT, config?: SnackBarConfig) {
    return this.snackBar.open(message, buttonText, { ...DEFAULT_CONFIG, ...config });
  }
}
