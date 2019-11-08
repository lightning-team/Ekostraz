import { animate, state, style, transition, trigger } from '@angular/animations';

export const fadeInOut = trigger('fadeInOut', [
  state(
    'hidden',
    style({
      visibility: 'hidden',
      opacity: 0,
    }),
  ),
  transition(':enter', [style({ opacity: 0 }), animate(500)]),
  transition(':leave', animate(300, style({ opacity: 0 }))),
  transition('hidden => *', animate(500, style({ visibility: 'initial', opacity: 1 }))),
]);
