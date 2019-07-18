import {Component, ViewChild} from '@angular/core';

@Component({
  selector: 'app-mobile-nav',
  templateUrl: './mobile-nav.component.html',
  styleUrls: ['./mobile-nav.component.scss']
})
export class MobileNavComponent {
  @ViewChild('nav', {static: false}) nav;

  toggle() {
    this.nav.toggle();
  }
}
