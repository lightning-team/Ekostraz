import { dotEnv, Environment } from './environment.common';

export const environment: Environment = {
  production: false,
  useSentry: true,
  useGoogleTagManager: true,
  ...dotEnv,
  APIUrl: 'https://test-url/api/',
  functionsKey: 'test-functions-key',
  mapsKey: 'test-maps-key',
};
