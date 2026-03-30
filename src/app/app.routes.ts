import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'evaluador-accesibilidad',
    loadComponent: () => import('./evaluador-accesibilidad/evaluador-accesibilidad.page').then(m => m.EvaluadorAccesibilidadPage)
  },
  {
    path: 'micropython/educadores',
    loadComponent: () => import('./micropython/educadores/educadores.page').then(m => m.EducadoresPage)
  },
  {
    path: 'micropython/estudiantes',
    loadComponent: () => import('./micropython/educadores/educadores.page').then(m => m.EducadoresPage)
  },

];
