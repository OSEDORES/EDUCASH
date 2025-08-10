import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroUsuariosPage } from './registro-usuarios.page';
const routes: Routes = [
  {
    path: '',
    component: RegistroUsuariosPage
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistroUsuariosPageRoutingModule {}
