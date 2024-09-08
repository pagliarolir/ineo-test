import {Routes} from '@angular/router';
import {ApplicationRoutes} from "./models/enums/routes.enum";

export const routes: Routes = [
  {
    path: ApplicationRoutes.HOME,
    loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent)
  },
  {
    path: '**',
    redirectTo: ApplicationRoutes.HOME
  }
];
