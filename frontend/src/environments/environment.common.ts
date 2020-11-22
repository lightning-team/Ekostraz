import { dotenv } from './dotenv';

export interface Environment {
  production: boolean;
  useSentry: boolean;
  sentryDSN: string;
  useGoogleTagManager: boolean;
  tagManagerId: string;
  cloudAppUrl: string;
  APIUrl: string;
  functionsKey: string;
  mapsKey: string;
  isLocalhost: () => boolean;
  useMockUser?: boolean;
}

export const commonEnvironment: Pick<
  Environment,
  'sentryDSN' | 'tagManagerId' | 'functionsKey' | 'mapsKey' | 'isLocalhost'
> = {
  sentryDSN: 'https://bc6889e92f5d4c9d941ed23760f38d37@sentry.io/1548140',
  tagManagerId: 'GTM-PH9WQ8J',
  functionsKey: dotenv.functionsKey,
  mapsKey: dotenv.mapsKey,
  isLocalhost() {
    return this.cloudAppUrl.includes('localhost');
  },
};
