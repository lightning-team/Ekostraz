import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, of } from 'rxjs';

import { InterventionsService } from '../../interventions.service';
import { catchError, finalize } from 'rxjs/operators';

import { Intervention, InterventionsFilter } from '@shared/domain/intervention.model';

export class InterventionsDatasource implements DataSource<Intervention> {
  private interventionSubject = new BehaviorSubject<Intervention[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private interventionsService: InterventionsService) {}

  connect(collectionViewer: CollectionViewer): Observable<Intervention[]> {
    return this.interventionSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.interventionSubject.complete();
    this.loadingSubject.complete();
  }

  loadInterventions(params: InterventionsFilter) {
    this.loadingSubject.next(true);
    this.interventionsService
      .getInterventions(params)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)),
      )
      .subscribe(interventions => this.interventionSubject.next(interventions));
  }
}
