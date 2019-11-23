import { animate, query, style, transition, trigger } from '@angular/animations';

const optional = { optional: true };

const commonStyles = query(
  ':enter, :leave',
  [
    style({
      position: 'absolute',
      left: 0,
      width: '100%',
    }),
  ],
  optional,
);

const beforeLeaveStyle = query(':leave', [style({ opacity: 1 })], optional);
const pageOutAnimation = query(':leave', [animate('200ms ease', style({ opacity: 0 }))], optional);

const beforeEnterStyle = query(':enter', [style({ opacity: 0 })], optional);
const pageInAnimation = query(':enter', [animate('300ms ease', style({ opacity: 1 }))], optional);

export const routeFader = trigger('routeAnimation', [
  transition('* <=> *', [commonStyles, beforeLeaveStyle, beforeEnterStyle, pageOutAnimation, pageInAnimation]),
]);
