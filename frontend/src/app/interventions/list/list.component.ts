import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ServerIntervention, ClientIntervention } from '../intervention';
import { InterventionsService } from '../interventions.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class InterventionsListComponent implements OnInit, OnDestroy {
  private subscription: Subscription | null = null;
  interventions: ClientIntervention[] = [];
  isloading: boolean;

  constructor(
    private router: Router,
    private interventionsService: InterventionsService,
  ) { }

  ngOnInit() {
    this.isloading = true;
    this.subscription = this.interventionsService.getInterventions()
      .subscribe(
        (resp) => this.onSuccess(resp),
        () => this.onFailure(),
        () => this.onCompleted(),
      );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  showMap() {
    this.router.navigate(['interventions', 'map'], { state: this.interventions });
  }

  private onSuccess(data: ServerIntervention[]) {
    this.interventions = data.map(this.mapToTableData);
    console.log(this.interventions);
  }

  private onFailure() {
    console.log('Something went wrong');
  }

  private onCompleted() {
    this.subscription = null;
    this.isloading = false;
  }

  private mapToTableData(intervention: ServerIntervention, index: number): ClientIntervention {
    return new ClientIntervention(intervention, index);
  }
}
