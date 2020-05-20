import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { LoginComponent } from './login/login.component';
import { AuthService } from './auth.service';

@NgModule({
  declarations: [LoginComponent],
  imports: [SharedModule],
  exports: [LoginComponent],
  providers: [AuthService],
})
export class AuthModule {}
