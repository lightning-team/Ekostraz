import { animate, state, style, transition, trigger } from '@angular/animations';

export function createFadeInOut(enterTiming: number | string = 500, leaveTiming: number | string = 300) {
  return trigger('fadeInOut', [
    state(
      'hidden',
      style({
        visibility: 'hidden',
        opacity: 0,
      }),
    ),
    transition(':enter', [style({ opacity: 0 }), animate(enterTiming)]),
    transition(':leave', animate(leaveTiming, style({ opacity: 0 }))),
    transition('hidden => *', animate(enterTiming, style({ visibility: 'initial', opacity: 1 }))),
  ]);
}

export const fadeInOut = createFadeInOut();
