import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AuthUrlsFactory } from '../../auth/auth-urls.factory';
import { User } from '../../auth/user.model';

@Component({
  selector: 'eko-desktop-nav',
  templateUrl: './desktop-nav.component.html',
  styleUrls: ['./desktop-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesktopNavComponent {
  @Input() isLoggedIn = false;
  @Input() gtmContext;
  @Input() user: User;

  loginUrl = AuthUrlsFactory.googleLoginUrl();
  logoutUrl = AuthUrlsFactory.logoutUrl;
}
