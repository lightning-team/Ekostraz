/**
 * @see {https://github.com/Lacka90/angular-dotenv-poc/blob/master/src/app/config/dotenv.ts}
 * @see {https://codingsans.com/blog/configure-frontend-projects-with-dotenv}
 */
import * as loadedDotenv from '!val-loader!./dotenv-loader';

export interface IDotenv {
  functionsKey: string;
  mapsKey: string;
  captchaSiteKey: string;
}

export const dotenv = loadedDotenv as IDotenv;
