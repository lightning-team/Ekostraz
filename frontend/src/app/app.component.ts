import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ekostraz';

  constructor(private authService: AuthService) { }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }
}
