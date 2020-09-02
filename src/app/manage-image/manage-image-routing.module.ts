import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageImagePage } from './manage-image.page';

const routes: Routes = [
  {
    path: '',
    component: ManageImagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageImagePageRoutingModule {}
