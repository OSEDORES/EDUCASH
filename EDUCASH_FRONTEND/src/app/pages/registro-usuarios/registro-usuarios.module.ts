import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RegistroUsuariosPage } from './registro-usuarios.page';
import { RegistroUsuariosPageRoutingModule } from './registro-usuarios-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroUsuariosPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RegistroUsuariosPage]
})
export class RegistroUsuariosPageModule {}
