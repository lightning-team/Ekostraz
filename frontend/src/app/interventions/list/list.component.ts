import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ClientIntervention, ListIntervention} from '../types';
import { InterventionsService } from '../interventions.service';
import { Router } from '@angular/router';


function mapToTableData(intervention: ClientIntervention, index: number): ListIntervention {
  return {...intervention, position: index + 1};
}


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
    this.router.navigate(['interwencje', 'mapa'], { state: this.interventions });
  }

  private onSuccess(interventions: ClientIntervention[]) {
    this.interventions = interventions.map(mapToTableData);
  }

  private onFailure() {
    console.log('Something went wrong');
  }

  private onCompleted() {
    this.subscription = null;
    this.isloading = false;
  }
}
