import { Routes } from '@angular/router';

export const MICROBIT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./microbit.page').then(m => m.MicrobitPage)
  },
  {
    path: 'accessible-programming',
    loadComponent: () => import('./accessible-programming/accessible-programming.page').then(m => m.AccessibleProgrammingPage)
  },
  {
    path: 'countdown',
    loadComponent: () => import('./countdown/countdown.page').then(m => m.CountdownPage)
  },
  {
    path: 'duel',
    loadComponent: () => import('./duel/duel.page').then(m => m.DuelPage)
  },
  {
    path: 'heartbeat',
    loadComponent: () => import('./heart/heart.page').then(m => m.HeartPage)
  },
  {
    path: 'stone-paper-scissors',
    loadComponent: () => import('./stone-paper-scissors/stone-paper-scissors.page').then(m => m.StonePaperScissorsPage)
  },
  {
    path: 'secret-message',
    loadComponent: () => import('./secret-message/secret-message.page').then(m => m.SecretMessagePage)
  }
];
