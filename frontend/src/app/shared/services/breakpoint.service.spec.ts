import {BreakpointObserver} from '@angular/cdk/layout';
import {TestScheduler} from 'rxjs/testing';

import {BreakpointService} from './breakpoint.service';
import {Observable, of} from 'rxjs';

const testScheduler = new TestScheduler((actual, expected) => {
  expect(actual).toEqual(expected);
});


describe('BreakpointService', () => {
  let service;

  function setup(sourceObservable: Observable<any>) {
    const breakpointObserver = {
      observe: () => of({}),
    };
    spyOn(breakpointObserver, 'observe').and.returnValue(sourceObservable);

    return new BreakpointService(breakpointObserver as unknown as BreakpointObserver);
  }

  afterEach(() => {
    service = null;
  });

  it('should return correct observable values on multiple subscriptions', () => {
    testScheduler.run(({ hot, expectObservable }) => {
      const emittedMarbleValues = {a: {matches: true}, b: {matches: false}};
      const expectedMarbleValues = {a: true, b: false};

      const hotSource = hot('--a--a--b--a--a-', emittedMarbleValues);
      const sub1 = '         ---^--------!';
      const expect1 = '      -----a--b--a-';
      const sub2 = '         ---------^--------!';
      const expect2 = '      ---------b-a--a-';

      service =  setup(hotSource);

      expectObservable(service.isMobileView$, sub1).toBe(expect1, expectedMarbleValues);
      expectObservable(service.isMobileView$, sub2).toBe(expect2, expectedMarbleValues);
    });
  });
});
