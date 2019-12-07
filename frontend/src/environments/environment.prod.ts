import { commonEnvironment, Environment } from './environment.common';

export const environment: Environment = {
  production: true,
  useSentry: true,
  useGoogleTagManager: true,
  // TODO: Url below is the same as dev env now. Add real prod url for the v1 release
  APIUrl: 'https://ekostrazstagging.azurewebsites.net/api/',
  ...commonEnvironment,
};
