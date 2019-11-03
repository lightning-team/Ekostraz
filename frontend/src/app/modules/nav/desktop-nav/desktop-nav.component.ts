import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-desktop-nav',
  templateUrl: './desktop-nav.component.html',
  styleUrls: ['./desktop-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesktopNavComponent {
    @Input() isLoggedIn = false;
    @Input() gtmContext;
    @Output() logIn = new EventEmitter();
    @Output() logOut = new EventEmitter();
}
