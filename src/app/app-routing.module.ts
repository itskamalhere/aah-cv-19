import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'patient-details',
    loadChildren: () => import('./pages/patient/patient-details/patient-details.module').then( m => m.PatientDetailsPageModule)
  },
  {
    path: 'patient-list',
    loadChildren: () => import('./pages/patient/patient-list/patient-list.module').then( m => m.PatientListPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
