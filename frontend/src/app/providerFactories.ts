import { ErrorHandler } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { default as localePl } from '@angular/common/locales/pl';
import { SentryErrorHandler } from './SentryErrorHandler';

export function localeProviderFactory(): string {
  registerLocaleData(localePl);
  return 'pl';
}

export function errorHandlerFactory(useSentry: boolean, dsn: string): () => ErrorHandler {
  return () => (useSentry ? new SentryErrorHandler(dsn) : new ErrorHandler());
}
