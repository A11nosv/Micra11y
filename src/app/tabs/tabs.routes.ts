import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'micropython',
        loadComponent: () =>
          import('../micropython/micropython.page').then((m) => m.MicropythonPage),
      },
      {
        path: 'microbit',
        loadChildren: () =>
          import('../microbit/microbit.routes').then((m) => m.MICROBIT_ROUTES),
      },
      {
        path: 'microia',
        loadComponent: () =>
          import('../microia/microia.page').then((m) => m.MicroiaPage),
      },
      {
        path: 'repositorio',
        loadComponent: () =>
          import('../repositorio/repositorio.page').then((m) => m.RepositorioPage),
      },


      {
        path: '',
        redirectTo: '/tabs/microbit',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/microbit',
    pathMatch: 'full',
  },
];
