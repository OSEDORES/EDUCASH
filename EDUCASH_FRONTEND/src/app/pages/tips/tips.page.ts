import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';

interface Ejemplo {
  nombre: string;
  descripcion: string;
  tip: string;
}

interface SeccionContenido {
  titulo_seccion: string;
  descripcion: string;
  estadistica?: string;
  items?: string[];
}

interface Recurso {
  tipo: string;
  titulo: string;
  url: string;
}

interface DatosClave {
  porcentaje_ingresos: number;
  impacto: string;
  flexibilidad: string;
}

interface Tip {
  id: number;
  titulo: string;
  icono: string;
  definicion: string;
  datos_clave: DatosClave;
  ejemplos: Ejemplo[];
  contenido: SeccionContenido[];
  recursos?: Recurso[];
}

@Component({
  selector: 'app-tips',
  templateUrl: './tips.page.html',
  styleUrls: ['./tips.page.scss'],
  standalone: false,
})
export class TipsPage {
  tips: Tip[] = [];
  tipSeleccionado: Tip | null = null;

  constructor(
    private http: HttpClient,
    private navCtrl: NavController,
    private menu: MenuController) {}

  ionViewDidEnter() {
    this.cargarTips();
  }

  cargarTips() {
    this.http.get<Tip[]>('http://localhost:3000/tips').subscribe(data => {
      this.tips = data;
      if (data.length > 0) {
        this.tipSeleccionado = data[0]; // Auto-selecciona el primer tip
      }
    });
  }

  ionViewWillEnter() {
    this.menu.enable(true); // Habilita el menú al entrar
  }

  ionViewWillLeave() {
    this.menu.enable(false); // Opcional: deshabilita al salir
  }
}