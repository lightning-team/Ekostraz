import { environment } from '@environment';
import { EkoRoutePaths } from '../../eko-route-paths';

const ROUTE_HASH_SEPARATOR = '/#';
const SUCCESSFUL_LOGIN_ROUTE = '/' + EkoRoutePaths.Interventions;

const currentIfLocalhost = (url: string) => (environment.isLocalhost() ? location.href : url);

export const AuthUrlsFactory = {
  googleLoginUrl: (previousUrl: string = SUCCESSFUL_LOGIN_ROUTE) =>
    currentIfLocalhost(
      environment.cloudAppUrl +
        '.auth/login/google?post_login_redirect_uri=' +
        encodeURI(location.origin + ROUTE_HASH_SEPARATOR + previousUrl),
    ),
  logoutUrl: currentIfLocalhost(environment.cloudAppUrl + '.auth/logout?post_logout_redirect_uri=' + location.origin),
  meUrl: environment.cloudAppUrl + '.auth/me',
};
