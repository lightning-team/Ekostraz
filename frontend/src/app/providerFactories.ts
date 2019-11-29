import { ErrorHandler } from '@angular/core';
import { SentryErrorHandler } from './SentryErrorHandler';

export function localeProviderFactory(): string {
  return 'pl';
}

export function errorHandlerFactory(useSentry: boolean, dsn: string): () => ErrorHandler {
  return () => (useSentry ? new SentryErrorHandler(dsn) : new ErrorHandler());
}
