import { commonEnvironment, Environment } from './environment.common';

export const environment: Environment = {
  production: false,
  useSentry: true,
  useGoogleTagManager: true,
  APIUrl: 'https://test-url/api/',
  ...commonEnvironment,
};
