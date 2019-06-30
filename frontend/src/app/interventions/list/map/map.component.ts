import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClientIntervention, ServerIntervention } from '../../intervention';
import { Subscription } from 'rxjs';
import { InterventionsService } from '../../interventions.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-interventions-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class InterventionsMapComponent implements OnInit, OnDestroy {
  private subscription: Subscription | null = null;

  interventions: ClientIntervention[] = [];

  constructor(
    private router: Router,
    private interventionsService: InterventionsService,
  ) { }

  ngOnInit() {
    const currentNavigation = this.router.getCurrentNavigation();
    const routerInterventions = currentNavigation && currentNavigation.extras.state as ClientIntervention[] | undefined;
    if (routerInterventions) {
      this.interventions = routerInterventions;
    } else {
      this.subscription = this.interventionsService.getInterventions()
        .subscribe(
          resp => this.onSuccess(resp),
          () => this.onFailure(),
          () => this.onCompleted(),
        );
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  // TODO: Logic below is the same as list.component.ts - try to extract/abstract upon it.
  private onSuccess(data: ServerIntervention[]) {
    this.interventions = data.map(this.mapToClientInterventions);
    console.log(this.interventions);
  }

  private onFailure() {
    console.log('Something went wrong');
  }

  private onCompleted() {
    this.subscription = null;
  }

  private mapToClientInterventions(intervention: ServerIntervention, index: number): ClientIntervention {
    return new ClientIntervention(intervention, index);
  }
}
