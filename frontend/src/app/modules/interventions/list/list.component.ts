import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { GTM_CONTEXTS } from '@shared/google-tag-manager/gtm-contexts';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {
  interventionsListGtmContext: string;

  constructor(private router: Router, @Inject(GTM_CONTEXTS) gtmContexts) {
    this.interventionsListGtmContext = gtmContexts.interventionList;
  }

  showMap() {
    this.router.navigate(['interwencje', 'mapa']);
  }
}
