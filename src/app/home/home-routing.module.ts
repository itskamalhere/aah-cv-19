import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'tab1',
        children: [
          {
            path: '',
            loadChildren: () => import('../patient-list/patient-list.module').then(m => m.PatientListPageModule)
          }
        ]
      },
      {
        path: 'patient-list',
        children: [
          {
            path: '',
            loadChildren: () => import('../patient-list/patient-list.module').then(m => m.PatientListPageModule)
          }
        ]
      },
      {
        path: 'patient-details',
        children: [
          {
            path: '',
            loadChildren: () => import('../patient-details/patient-details.module').then(m => m.PatientDetailsPageModule)
          }
        ]
      },
      {
        path: 'tab4',
        children: [
          {
            path: '',
            loadChildren: () => import('../patient-list/patient-list.module').then(m => m.PatientListPageModule)
          }
        ]
      },
      {
        path: 'tab5',
        children: [
          {
            path: '',
            loadChildren: () => import('../patient-list/patient-list.module').then(m => m.PatientListPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      }
    ]    
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
