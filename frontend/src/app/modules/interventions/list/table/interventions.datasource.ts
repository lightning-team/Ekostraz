import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, of } from 'rxjs';

import { InterventionsService } from '../../interventions.service';
import { finalize, switchMapTo, tap } from 'rxjs/operators';

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

  loadInterventions$(params: InterventionsFilter) {
    return of<Intervention[]>([]).pipe(
      tap(() => this.loadingSubject.next(true)),
      switchMapTo(
        this.interventionsService.getInterventions(params).pipe(
          tap(interventions => this.interventionSubject.next(interventions)),
          finalize(() => this.loadingSubject.next(false)),
        ),
      ),
    );
  }
}
