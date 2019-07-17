import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule, MatIconModule, MatToolbarModule} from '@angular/material';
import {RouterModule} from '@angular/router';

import {NavComponent} from './nav.component';
import { DesktopNavComponent } from './desktop-nav/desktop-nav.component';
import { MobileNavComponent } from './mobile-nav/mobile-nav.component';

@NgModule({
  declarations: [
    NavComponent,
    DesktopNavComponent,
    MobileNavComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    RouterModule,
  ],
  exports: [
    NavComponent,
  ],
})
export class NavModule { }
