import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecuperarUsuariosPage } from './recuperar-usuarios.page';

const routes: Routes = [
  {
    path: '',
    component: RecuperarUsuariosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecuperarUsuariosPageRoutingModule {}
