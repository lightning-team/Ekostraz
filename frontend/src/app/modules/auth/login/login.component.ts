import {Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ComponentWithSubscriptions} from '@shared/base';
import {AuthService} from '../auth.service';

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
  @ViewChild('dialogTemplate', {static: true}) dialogTemplate: TemplateRef<any>;

  constructor(private dialogService: MatDialog, private authService: AuthService) {
    super();
  }

  ngOnInit() {
    const dialog = this.dialogService.open(this.dialogTemplate, {
      disableClose: true,
      backdropClass: DIALOG_BACKDROP_CLASS,
      panelClass: DIALOG_PANEL_CLASS,
    });
    const dialogSubscription = dialog.afterClosed().subscribe();
    this.subscriptions.add(dialogSubscription);
  }

  onLoginClick() {
    this.authService.logIn();
  }
}
