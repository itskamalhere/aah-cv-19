import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientListPage } from './patient-list.page';

const routes: Routes = [
  {
    path: '',
    component: PatientListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientListPageRoutingModule {}