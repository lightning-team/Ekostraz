export interface Environment {
  production: boolean;
  useSentry: boolean;
  sentryDSN: string;
  useGoogleTagManager: boolean;
  tagManagerId: string;
}

export const commonEnvironment: Pick<
  Environment,
  "sentryDSN" | "tagManagerId"
> = {
  sentryDSN: "https://bc6889e92f5d4c9d941ed23760f38d37@sentry.io/1548140",
  tagManagerId: "GTM-PH9WQ8J"
};
