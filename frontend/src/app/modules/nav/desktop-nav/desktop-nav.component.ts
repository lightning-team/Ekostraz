import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuItems, menuItems } from '../menu-items-common';
import { EkoRoutePaths } from '@app/eko-route-paths';

@Component({
  selector: 'eko-desktop-nav',
  templateUrl: './desktop-nav.component.html',
  styleUrls: ['./desktop-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesktopNavComponent {
  @Input() isLoggedIn = false;
  @Input() gtmContext;
  @Output() logOut = new EventEmitter();
  menuItems: MenuItems = menuItems;
  ekoRoutePaths = EkoRoutePaths;
}
