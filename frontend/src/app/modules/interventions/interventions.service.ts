import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { map, switchMap, pluck } from 'rxjs/operators';

import { environment } from '@environment';
import { SnackBarManager } from '@shared/services/snack-bar-manager';
import { Intervention, RawServerIntervention } from '@shared/domain/intervention.model';

@Injectable()
export class InterventionsService {
  private interventionsUrl = environment.APIUrl + 'interventions';

  constructor(private http: HttpClient, private snackBar: SnackBarManager, private location: Location) {}

  getInterventions(): Observable<Intervention[]> {
    return this.getFromLocationState<Intervention[]>('interventions').pipe(
      switchMap(interventions => (interventions ? of(interventions) : this.fetchInterventions())),
    );
  }

  private fetchInterventions(): Observable<Intervention[]> {
    return this.http.get<any>(this.interventionsUrl).pipe(
      map(data => data.map(toIntervention)),
      this.snackBar.failurePipe(),
    );
  }

  getIntervention(routeParams: Observable<Params>): Observable<Intervention | null> {
    return this.getFromLocationState<Intervention>('intervention').pipe(
      switchMap(intervention => (intervention ? of(intervention) : this.getActiveRouteIntervention(routeParams))),
    );
  }

  private getActiveRouteIntervention(routeParams: Observable<Params>): Observable<Intervention | null> {
    return routeParams.pipe(
      pluck<any, string>('interventionId'),
      switchMap(interventionId => (interventionId ? this.fetchIntervention(interventionId) : of(null))),
    );
  }

  fetchIntervention(id: string): Observable<Intervention> {
    return this.http
      .get<RawServerIntervention>(`${this.interventionsUrl}/${id}`)
      .pipe(map(toIntervention), this.snackBar.failurePipe());
  }

  submitComment(comment: string, id: string): Observable<any> {
    return this.http.post(`${this.interventionsUrl}/${id}/comments`, {
      comment,
    });
  }

  private getFromLocationState<StateObject>(stateKey: string): Observable<StateObject | undefined> {
    return of(this.location.getState()).pipe(pluck<any, StateObject>(stateKey));
  }
}

const toIntervention = (rawIntervention: RawServerIntervention): Intervention => ({
  ...rawIntervention,
  address: `${rawIntervention.street}, ${rawIntervention.streetNumber}, ${rawIntervention.city}`,
});
