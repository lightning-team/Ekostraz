import { commonEnvironment, Environment } from './environment.common';

// TODO: Url below is the same as dev env now. Add real prod url for the v1 release
const cloudAppUrl = 'https://ekostrazstagging.azurewebsites.net/';

export const environment: Environment = {
  production: true,
  useSentry: true,
  useGoogleTagManager: true,
  cloudAppUrl,
  APIUrl: cloudAppUrl + 'api/',
  ...commonEnvironment,
};
