import {style, trigger,state,transition,animate} from '@angular/animations'
export const slideInOut = trigger('flyInOut',[
    state('inactive',style({transform: 'translateX(100%)',opacity:0})),
    state('active',style({transform: 'translateX(0)',opacity:1})),
    state('removed',style({transform: 'translateX(100%)',opacity:0})),
    transition('inactive => active',animate('300ms ease-in')),
    transition('active => removed',animate('300ms ease-out')),
]) 