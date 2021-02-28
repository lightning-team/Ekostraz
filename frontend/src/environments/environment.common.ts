/**
 * @see {https://github.com/Lacka90/angular-dotenv-poc/blob/master/src/app/config/dotenv.ts}
 * @see {https://codingsans.com/blog/configure-frontend-projects-with-dotenv}
 */
import * as loadedDotenv from '!val-loader!./dotenv-loader';

export interface DotEnv {
  functionsKey: string;
  mapsKey: string;
  captchaSiteKey: string;
  APIUrl: string;
  sentryDSN: string;
  tagManagerId: string;
}

export const dotEnv: DotEnv = loadedDotenv;

export interface Environment extends DotEnv {
  production: boolean;
  useSentry: boolean;
  useGoogleTagManager: boolean;
}
