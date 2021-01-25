import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, pipe, UnaryFunction } from 'rxjs';
import { finalize, ignoreElements, skip, switchMap, tap } from 'rxjs/operators';

import { Subscribable } from '@shared/components/base';
import { Intervention, InterventionsFilter } from '@shared/domain/intervention.model';
import { InterventionsService } from '../interventions.service';

@Injectable()
export class InterventionsDatasource extends Subscribable implements DataSource<Intervention> {
  private interventionSubject = new BehaviorSubject<Intervention[]>([]);
  private totalCountSubject = new BehaviorSubject<number>(0);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  private loadInterventionsPipe: UnaryFunction<Observable<InterventionsFilter>, Observable<never>> = pipe(
    tap(() => this.loadingSubject.next(true)),
    switchMap(params =>
      this.interventionsService.getInterventions(params).pipe(
        tap(({ results, totalCount }) => {
          this.interventionSubject.next(results);
          this.totalCountSubject.next(totalCount);
        }),
        finalize(() => this.loadingSubject.next(false)),
      ),
    ),
    ignoreElements(),
  );

  public filtersSubject = new BehaviorSubject<InterventionsFilter>({});
  public totalCount$ = this.totalCountSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(private interventionsService: InterventionsService) {
    super();
    this.subscriptions.add(
      this.filtersSubject
        .asObservable()
        .pipe(skip(1), this.loadInterventionsPipe)
        .subscribe(),
    );
  }

  connect(collectionViewer: CollectionViewer): Observable<Intervention[]> {
    return this.interventionSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.interventionSubject.complete();
    this.loadingSubject.complete();
    this.totalCountSubject.complete();
    this.filtersSubject.complete();
  }
}
