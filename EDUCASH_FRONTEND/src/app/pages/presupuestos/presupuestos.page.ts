import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { AlertController, ModalController } from '@ionic/angular';
import { CrearPresupuestoModalComponent } from './crear-presupuesto-modal/crear-presupuesto-modal.component'; // Asumo que crearás este modal
import { NavController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';

interface Presupuesto {
  id: number;
  nombre: string;
  categoria: string;
  tipo: 'Gasto' | 'Ingreso' | 'Ahorro'; // Más flexible
  montoTotal: number;
  montoUsado: number;
  periodo: 'Diario' | 'Semanal' | 'Mensual' | 'Anual';
  objetivo?: string; // Opcional
}

@Component({
  selector: 'app-presupuestos',
  templateUrl: './presupuestos.page.html',
  styleUrls: ['./presupuestos.page.scss'],
  standalone: false,
})
export class PresupuestosPage implements OnInit {
  presupuestos: Presupuesto[] = [];

  constructor(
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private http: HttpClient,
    private navCtrl: NavController,
    private menu: MenuController) {}

  ngOnInit() {
    this.cargarPresupuestos();
  }

  async cargarPresupuestos() {
    try {
      // 1. Intenta cargar de localStorage
      const datosLocales = localStorage.getItem('presupuestos');
      
      if (datosLocales) {
        this.presupuestos = JSON.parse(datosLocales);
        console.log('Datos cargados de localStorage:', this.presupuestos);
      } else {
        // 2. Si no hay en localStorage, carga del JSON
        const data: any = await this.http.get('assets/data/DataEDUCASH.json').toPromise();
        
        if (data?.presupuestos) {
          this.presupuestos = data.presupuestos;
          localStorage.setItem('presupuestos', JSON.stringify(data.presupuestos));
          console.log('Datos cargados de JSON:', this.presupuestos);
        } else {
          console.warn('El JSON no tiene propiedad "presupuestos"');
        }
      }
    } catch (error) {
      console.error('Error al cargar presupuestos:', error);
      this.presupuestos = [];
    }
  }

  async abrirModalCrearPresupuesto() {
    const modal = await this.modalCtrl.create({
      component: CrearPresupuestoModalComponent
    });
    await modal.present();  
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.cargarPresupuestos();
    }
  }

  calcularProgreso(montoUsado: number, montoTotal: number): number {
    return (montoUsado / montoTotal) * 100;
  }

  async abrirModalEditarPresupuesto(presupuesto: any) {
    const modal = await this.modalCtrl.create({
      component: CrearPresupuestoModalComponent,
      componentProps: {
        presupuesto: presupuesto // Pasamos el presupuesto a editar
      }
    });
  
    await modal.present();
  
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.actualizarPresupuesto(data); // Actualiza en localStorage
    }
  }
  
  actualizarPresupuesto(presupuestoActualizado: any) {
    const presupuestos = JSON.parse(localStorage.getItem('presupuestos') || '[]');
    const index = presupuestos.findIndex((p: any) => p.id === presupuestoActualizado.id);
    
    if (index !== -1) {
      presupuestos[index] = presupuestoActualizado;
      localStorage.setItem('presupuestos', JSON.stringify(presupuestos));
      this.cargarPresupuestos(); // Recarga la lista
    }
  }

  eliminarPresupuesto(id: number) {
    // Confirmación antes de eliminar
    this.mostrarAlertaConfirmacion(id);
  }

  async mostrarAlertaConfirmacion(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de eliminar este presupuesto?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Eliminar', 
          handler: () => {
            const presupuestos = JSON.parse(localStorage.getItem('presupuestos') || '[]');
            const nuevosPresupuestos = presupuestos.filter((p: any) => p.id !== id);
            localStorage.setItem('presupuestos', JSON.stringify(nuevosPresupuestos));
            this.cargarPresupuestos(); // Recarga la lista
          }
        }
      ]
    });
    await alert.present();
  }

  ionViewWillEnter() {
    this.menu.enable(true); // Habilita el menú al entrar
  }

  ionViewWillLeave() {
    this.menu.enable(false); // Opcional: deshabilita al salir
  }
}
