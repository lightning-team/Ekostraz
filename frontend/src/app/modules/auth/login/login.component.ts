import { Component, Inject, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ComponentWithSubscriptions } from '@shared/components/base';
import { AuthService } from '../auth.service';
import { GTM_CONTEXTS } from '@shared/google-tag-manager/gtm-contexts';

const DIALOG_BACKDROP_CLASS = 'login-dialog-backdrop';
const DIALOG_PANEL_CLASS = 'login-dialog-panel';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  // Overrides default encapsulation so that dialog styles get applied properly.
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent extends ComponentWithSubscriptions implements OnInit {
  @ViewChild('dialogTemplate', { static: true }) dialogTemplate: TemplateRef<any>;
  dialog: MatDialogRef<any>;
  loginDialogGtmContext: string;

  constructor(private dialogService: MatDialog, private authService: AuthService, @Inject(GTM_CONTEXTS) gtmContexts) {
    super();
    this.loginDialogGtmContext = gtmContexts.loginDialog;
  }

  ngOnInit() {
    this.dialog = this.createLoginDialog();
  }

  onLoginClick() {
    this.authService.logIn();
    this.dialog.close();
  }

  private createLoginDialog() {
    const dialog = this.dialogService.open(this.dialogTemplate, {
      disableClose: true,
      backdropClass: DIALOG_BACKDROP_CLASS,
      panelClass: DIALOG_PANEL_CLASS,
    });
    const dialogSubscription = dialog.afterClosed().subscribe();
    this.subscriptions.add(dialogSubscription);

    return dialog;
  }
}
