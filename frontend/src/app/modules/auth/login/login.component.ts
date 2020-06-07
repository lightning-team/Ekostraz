import { Component, Inject, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { ComponentWithSubscriptions } from '@shared/components/base';
import { GTM_CONTEXTS } from '@shared/google-tag-manager/gtm-contexts';
import { AuthUrlsFactory } from '../auth-urls.factory';

const DIALOG_BACKDROP_CLASS = 'login-dialog-backdrop';
const DIALOG_PANEL_CLASS = 'login-dialog-panel';

@Component({
  selector: 'eko-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  // Overrides default encapsulation so that dialog styles get applied properly.
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent extends ComponentWithSubscriptions implements OnInit {
  @ViewChild('dialogTemplate', { static: true }) dialogTemplate: TemplateRef<any>;

  loginLink = AuthUrlsFactory.googleLoginUrl(
    this.activatedRoute.snapshot.queryParamMap.get('previousUrl') || undefined,
  );
  loginDialogGtmContext: string;

  constructor(
    private dialogService: MatDialog,
    private activatedRoute: ActivatedRoute,
    @Inject(GTM_CONTEXTS) gtmContexts,
  ) {
    super();
    this.loginDialogGtmContext = gtmContexts.loginDialog;
  }

  ngOnInit() {
    this.createLoginDialog();
  }

  private createLoginDialog() {
    const dialog = this.dialogService.open(this.dialogTemplate, {
      disableClose: true,
      backdropClass: DIALOG_BACKDROP_CLASS,
      panelClass: DIALOG_PANEL_CLASS,
    });
    const dialogSubscription = dialog.afterClosed().subscribe();
    this.subscriptions.add(dialogSubscription);
  }
}
