import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule, MatProgressBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from '@environment';

import { AuthModule } from './modules/auth/auth.module';
import { AppRoutingModule } from './app-routing.module';
import { NavModule } from './modules/nav/nav.module';
import { PublicFormModule } from './modules/public-form/public-form.module';
import { SharedModule } from '@shared/shared.module';

import { AppComponent } from './app-component/app.component';
import { HomePageComponent } from './home-page/home-page.component';

import { GTM_CONTEXTS } from '@shared/google-tag-manager/gtm-contexts';
import { errorHandlerFactory, localeProviderFactory } from './misc/providerFactories';
import { EKOSTRAZ_GTM_CONTEXTS } from './misc/ekostraz-gtm-contexts';

@NgModule({
  declarations: [AppComponent, HomePageComponent],
  imports: [
    AuthModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatProgressBarModule,
    NavModule,
    PublicFormModule,
    SharedModule,
  ],
  providers: [
    { provide: LOCALE_ID, useFactory: localeProviderFactory },
    { provide: GTM_CONTEXTS, useValue: EKOSTRAZ_GTM_CONTEXTS },
    {
      provide: ErrorHandler,
      useFactory: errorHandlerFactory(environment.useSentry, environment.sentryDSN),
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
