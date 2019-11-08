import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatDialogModule } from '@angular/material';

import { SharedModule } from '@shared/shared.module';

import { LoginComponent } from './login/login.component';
import { AuthService } from './auth.service';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, MatButtonModule, MatDialogModule, SharedModule],
  exports: [LoginComponent],
  providers: [AuthService],
})
export class AuthModule {}
