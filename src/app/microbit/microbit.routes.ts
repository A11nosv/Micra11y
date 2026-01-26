import { Routes } from '@angular/router';

export const MICROBIT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./microbit.page').then(m => m.MicrobitPage)
  },
  {
    path: 'accessible_programming',
    loadComponent: () => import('./accessible-programming/accessible-programming.page').then(m => m.AccessibleProgrammingPage)
  },
  {
    path: 'countdown',
    loadComponent: () => import('./countdown/countdown.page').then(m => m.CountdownPage)
  }
];
