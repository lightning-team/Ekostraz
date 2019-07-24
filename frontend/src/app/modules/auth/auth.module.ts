import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule, MatDialogModule} from '@angular/material';

import { LoginComponent } from './login/login.component';
import {AuthService} from './auth.service';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
  ],
  exports: [LoginComponent],
  providers: [AuthService]
})
export class AuthModule { }
