import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {NavInterface} from '../nav.interface';

@Component({
  selector: 'app-desktop-nav',
  templateUrl: './desktop-nav.component.html',
  styleUrls: ['./desktop-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesktopNavComponent implements NavInterface {
    @Input() isLoggedIn = false;
    @Output() logIn = new EventEmitter();
    @Output() logOut = new EventEmitter();
}
