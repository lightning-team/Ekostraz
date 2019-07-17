import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule, MatToolbarModule} from '@angular/material';
import {RouterModule} from '@angular/router';

import {NavComponent} from './nav.component';

@NgModule({
  declarations: [
    NavComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatToolbarModule,
    RouterModule,
  ],
  exports: [
    NavComponent,
  ],
})
export class NavModule { }
