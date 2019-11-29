import { enableProdMode } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { default as localePl } from '@angular/common/locales/pl';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from '@environment';

if (environment.production) {
  enableProdMode();
}

registerLocaleData(localePl);

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
