import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { catchError, tap } from 'rxjs/operators';
import { of, pipe, throwError } from 'rxjs';

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

const DEFAULT_ERROR_MESSAGE = 'Ups! Przepraszamy, coś poszło nie tak!';
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
      this.failurePipe(errorMsg, buttonText, config),
    );
  }

  failurePipe(
    errorMsg: string = DEFAULT_ERROR_MESSAGE,
    buttonText: string = DEFAULT_BUTTON_TEXT,
    config?: SnackBarConfig,
    rethrow = true,
  ) {
    return pipe(
      catchError(err => {
        this.openSnackBar(errorMsg, buttonText, config);
        return rethrow ? throwError(err) : of(null);
      }),
    );
  }

  openSnackBar(message: string, buttonText: string = DEFAULT_BUTTON_TEXT, config?: SnackBarConfig) {
    return this.snackBar.open(message, buttonText, { ...DEFAULT_CONFIG, ...config });
  }
}
