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
    loadChildren: () => import('./patient-details/patient-details.module').then( m => m.PatientDetailsPageModule)
  },
  {
    path: 'patient-list',
    loadChildren: () => import('./patient-list/patient-list.module').then( m => m.PatientListPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'user-manage',
    loadChildren: () => import('./user-manage/user-manage.module').then( m => m.UserManagePageModule)
  },
  {
    path: 'manage-vitals',
    loadChildren: () => import('./manage-vitals/manage-vitals.module').then( m => m.ManageVitalsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
