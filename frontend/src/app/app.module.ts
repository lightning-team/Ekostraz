import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule, MatProgressBarModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AuthModule } from './modules/auth/auth.module';
import { AppRoutingModule } from './app-routing.module';
import { NavModule } from './modules/nav/nav.module';
import { PublicFormModule} from './modules/public-form/public-form.module';

import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';

import { errorHandlerFactory, localeProviderFactory } from './providerFactories';
import { environment } from '@environment';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
  ],
  imports: [
    AuthModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatProgressBarModule,
    NavModule,
    PublicFormModule,
    HttpClientModule,
  ],
  providers: [
    {provide: LOCALE_ID, useFactory: localeProviderFactory},
    {provide: ErrorHandler, useFactory: errorHandlerFactory(environment.useSentry, environment.sentryDSN)}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
