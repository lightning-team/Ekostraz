import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginFormComponent } from './login-form/login-form.component';
import {AuthService} from './auth.service';

@NgModule({
  declarations: [LoginFormComponent],
  imports: [
    CommonModule,
  ],
  exports: [
    LoginFormComponent,
  ],
  providers: [AuthService]
})
export class AuthModule { }
