import { animate, animateChild, query, style, transition, trigger } from '@angular/animations';
import { createFadeInOut } from '@shared/animations';

const hideLeft = style({ position: 'relative', left: '-100px', opacity: 0 });

export const fabButtonAnimation = trigger('showHideFab', [
  transition(':enter', [
    hideLeft, //
    animate('0.25s 0.5s ease-in-out'),
    query('@fadeInOut', animateChild()),
  ]),
  transition(':leave', animate(200, hideLeft)),
]);

const zeroSize = style({ width: 0, height: 0, margin: 0, padding: 0, opacity: 0, fontSize: 0 });

export const filtersCardAnimation = trigger('expandFilters', [
  transition(':enter', [
    zeroSize, //
    animate('0.25s 0.15s'),
    query('@fadeInOut', animateChild()),
  ]),
  transition(':leave', [
    query('@fadeInOut', animateChild()), //
    animate('0.25s 0.15s', zeroSize),
  ]),
]);

export const fadeInOut = createFadeInOut(250, 150);
