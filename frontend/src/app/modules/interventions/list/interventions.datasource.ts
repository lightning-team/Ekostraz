import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { finalize, switchMapTo, tap } from 'rxjs/operators';

import { Intervention, InterventionListResponse, InterventionsFilter } from '@shared/domain/intervention.model';
import { InterventionsService } from '../interventions.service';

@Injectable()
export class InterventionsDatasource implements DataSource<Intervention> {
  private interventionSubject = new BehaviorSubject<Intervention[]>([]);
  private totalCountSubject = new BehaviorSubject<number>(0);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public totalCount$ = this.totalCountSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(private interventionsService: InterventionsService) {}

  connect(collectionViewer: CollectionViewer): Observable<Intervention[]> {
    return this.interventionSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.interventionSubject.complete();
    this.loadingSubject.complete();
  }

  loadInterventions$(params: InterventionsFilter): Observable<InterventionListResponse> {
    return of<Intervention[]>([]).pipe(
      tap(() => this.loadingSubject.next(true)),
      switchMapTo(
        this.interventionsService.getInterventions(params).pipe(
          tap(({ results, totalCount }) => {
            this.interventionSubject.next(results);
            this.totalCountSubject.next(totalCount);
          }),
          finalize(() => this.loadingSubject.next(false)),
        ),
      ),
    );
  }
}
