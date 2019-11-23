import { ErrorHandler } from '@angular/core';
import * as Sentry from '@sentry/browser';

export class SentryErrorHandler implements ErrorHandler {
  constructor(dsn: string) {
    Sentry.init({ dsn });
  }

  handleError(error) {
    Sentry.captureException(error.originalError || error);
  }
}
