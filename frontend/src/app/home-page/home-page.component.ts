import { Component, Inject } from '@angular/core';
import { GTM_CONTEXTS } from '../modules/shared/google-tag-manager/gtm-contexts';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  homePageGtmContext: string;

  constructor(@Inject(GTM_CONTEXTS) gtmContexts) {
    this.homePageGtmContext = gtmContexts.homePage;
  }
}
