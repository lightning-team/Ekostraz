import { commonEnvironment, Environment } from './environment.common';

export const environment: Environment = {
  production: false,
  useSentry: true,
  useGoogleTagManager: true,
  cloudAppUrl: 'http://test-url',
  APIUrl: 'https://test-url/api/',
  ...commonEnvironment,
  functionsKey: 'test-functions-key',
  mapsKey: 'test-maps-key',
};
