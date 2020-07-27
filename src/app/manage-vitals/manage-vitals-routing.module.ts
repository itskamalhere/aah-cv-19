import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageVitalsPage } from './manage-vitals.page';

const routes: Routes = [
  {
    path: '',
    component: ManageVitalsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageVitalsPageRoutingModule {}
