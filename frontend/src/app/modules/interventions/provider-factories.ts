import { environment } from '@environment';

export function mapsConfigFactory() {
  return {
    apiKey: environment.mapsKey,
  };
}
