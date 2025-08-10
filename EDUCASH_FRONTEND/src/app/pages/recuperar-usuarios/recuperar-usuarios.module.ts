import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecuperarUsuariosPageRoutingModule } from './recuperar-usuarios-routing.module';

import { RecuperarUsuariosPage } from './recuperar-usuarios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecuperarUsuariosPageRoutingModule
  ],
  declarations: [RecuperarUsuariosPage]
})
export class RecuperarUsuariosPageModule {}
