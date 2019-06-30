import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { MatToolbarModule, MatButtonModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';

import localePl from '@angular/common/locales/pl';
registerLocaleData(localePl);
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
    MatToolbarModule,
    MatButtonModule,
  ],
  providers: [
    AuthService,
    { provide: LOCALE_ID, useValue: 'pl' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
