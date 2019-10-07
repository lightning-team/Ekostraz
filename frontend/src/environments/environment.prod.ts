import {commonEnvironment, Environment} from './environment.common';

export const environment: Environment = {
  production: true,
  useSentry: true,
  useGoogleTagManager: true,
  ...commonEnvironment,
};
