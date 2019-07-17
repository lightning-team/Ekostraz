import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NavInterface} from '../nav.interface';

@Component({
  selector: 'app-mobile-nav',
  templateUrl: './mobile-nav.component.html',
  styleUrls: ['./mobile-nav.component.scss']
})
export class MobileNavComponent implements NavInterface {
  @Input() isLoggedIn = false;
  @Output() logIn = new EventEmitter();
  @Output() logOut = new EventEmitter();
}
