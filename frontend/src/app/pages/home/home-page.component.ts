import { Component, Inject } from '@angular/core';
import { GTM_CONTEXTS } from '@shared/google-tag-manager/gtm-contexts';
import { EkoRoutePaths } from '@app/eko-route-paths';

@Component({
  selector: 'eko-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  homePageGtmContext: string;
  publicFormRoute = EkoRoutePaths.PublicForm;

  constructor(@Inject(GTM_CONTEXTS) gtmContexts) {
    this.homePageGtmContext = gtmContexts.homePage;
  }
}
