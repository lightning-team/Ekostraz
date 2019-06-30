import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginFormComponent } from './login-form/login-form.component';
import { AuthService } from './auth.service';
import { LoggedInUserGuard } from './logged-in-user.guard';
import { LoggedInMemberGuard } from './logged-in-member.guard';

@NgModule({
  declarations: [LoginFormComponent],
  imports: [
    CommonModule,
  ],
  exports: [
    LoginFormComponent,
    AuthService,
    LoggedInUserGuard,
    LoggedInMemberGuard,
  ],
  providers: [
    AuthService,
    LoggedInUserGuard,
    LoggedInMemberGuard,
  ]
})
export class AuthModule { }
