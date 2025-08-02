import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PresupuestosPageRoutingModule } from './presupuestos-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { PresupuestosPage } from './presupuestos.page';
import { CrearPresupuestoModalComponent } from './crear-presupuesto-modal/crear-presupuesto-modal.component';


const routes: Routes = [
  {
    path: '',
    component: PresupuestosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PresupuestosPageRoutingModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: [PresupuestosPage, CrearPresupuestoModalComponent],
})
export class PresupuestosPageModule {}
