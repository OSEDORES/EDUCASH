import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { CrearPresupuestoModalComponent } from './crear-presupuesto-modal/crear-presupuesto-modal.component';
import { ApiService } from '../../services/api.service';
import { MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

// Interfaces basadas en los procedimientos almacenados de tu backend
interface ApiPresupuesto {
  Id_Presupuesto: number;
  Nombre_Presupuesto: string;
  Tipo_Presupuesto: string;
  Periodo: string;
  Monto_Total: number;
  Monto_Usado: number;
  Objetivo?: string;
  Fecha_Creacion: string;
  Estado: string;
}

interface ApiDetallePresupuesto {
  Id_Detalle_Presupuesto: number;
  Id_Categoria_Ingreso: number | null;
  Id_Categoria_Gasto: number | null;
  Categoria: string;
  Icono: string;
  Color: string;
  Monto_Asignado: number;
  Monto_Usado: number;
}

interface Presupuesto {
  id: number;
  nombre: string;
  tipo: string;
  periodo: string;
  montoTotal: number;
  montoUsado: number;
  porcentajeUsado: number;
  objetivo?: string;
  estado: string;
  detalles: DetallePresupuesto[];
}

interface DetallePresupuesto {
  id: number;
  categoria: string;
  icono: string;
  color: string;
  montoAsignado: number;
  montoUsado: number;
}

@Component({
  selector: 'app-presupuestos',
  templateUrl: './presupuestos.page.html',
  styleUrls: ['./presupuestos.page.scss'],
  standalone: false,
})
export class PresupuestosPage implements OnInit {
  presupuestos: Presupuesto[] = [];
  loading: boolean = false;
  userId: number = 0;
  categoriasIngresos: any[] = [];
  categoriasGastos: any[] = [];

  constructor(
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private apiService: ApiService,
    private menu: MenuController,
    private storage: Storage
  ) {}

  async ngOnInit() {
    this.userId = await this.storage.get('userId') || 0;
    if (this.userId > 0) {
      await this.cargarCategorias();
      await this.cargarPresupuestos();
    } else {
      console.error('No se encontró userId en el almacenamiento');
    }
  }

  ionViewWillEnter() {
    this.menu.enable(true);
    if (this.userId > 0) {
      this.cargarPresupuestos();
    }
  }

  async cargarCategorias() {
    try {
      console.log(' Cargando categorías...');
      this.categoriasIngresos = await this.apiService.getCategoriasIngresos().toPromise() || [];
      this.categoriasGastos = await this.apiService.getCategoriasGastos().toPromise() || [];
      console.log(' Categorías cargadas:', { 
        categoriasIngresos: this.categoriasIngresos.length, 
        categoriasGastos: this.categoriasGastos.length 
      });
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  }

  async cargarPresupuestos() {
    this.loading = true;
    console.log(' Iniciando carga de presupuestos para usuario:', this.userId);
    try {
      const presupuestos = await this.apiService.getPresupuestosUsuario(this.userId).toPromise();
      
      console.log(' Datos de presupuestos recibidos:', presupuestos);

      if (!presupuestos || !Array.isArray(presupuestos)) {
        throw new Error('No se recibieron datos válidos');
      }

      console.log(' Total de presupuestos encontrados:', presupuestos.length);

      // Procesar cada presupuesto
      this.presupuestos = presupuestos.map((p: any) => ({
        id: p.Id_Presupuesto,
        nombre: p.Nombre_Presupuesto,
        tipo: p.Tipo_Presupuesto,
        periodo: p.Periodo,
        montoTotal: p.Monto_Total,
        montoUsado: p.Monto_Usado,
        porcentajeUsado: (p.Monto_Usado / p.Monto_Total) * 100,
        objetivo: p.Objetivo,
        estado: p.Estado,
        detalles: p.detalles || []
      }));

      console.log(' Todos los presupuestos procesados:', this.presupuestos.length, 'presupuestos');

    } catch (error) {
      console.error('Error al cargar presupuestos:', error);
      this.mostrarAlerta('Error', 'No se pudieron cargar los presupuestos');
      this.presupuestos = [];
    } finally {
      this.loading = false;
    }
  }

  async abrirModalCrearPresupuesto() {
    const modal = await this.modalCtrl.create({
      component: CrearPresupuestoModalComponent,
      componentProps: { 
        userId: this.userId,
        categoriasIngresos: this.categoriasIngresos,
        categoriasGastos: this.categoriasGastos
      }
    });
    
    await modal.present();
    
    const { data } = await modal.onWillDismiss();
    if (data?.actualizar) {
      this.cargarPresupuestos();
    }
  }

  calcularProgreso(montoUsado: number, montoTotal: number): number {
    if (montoTotal === 0) return 0;
    return Math.min((montoUsado / montoTotal) * 100, 100);
  }

  getColorProgreso(porcentaje: number): string {
    if (porcentaje > 90) return 'danger';
    if (porcentaje > 75) return 'warning';
    return 'success';
  }

  async abrirModalEditarPresupuesto(presupuesto: Presupuesto) {
    const modal = await this.modalCtrl.create({
      component: CrearPresupuestoModalComponent,
      componentProps: {
        presupuesto: presupuesto,
        userId: this.userId,
        categoriasIngresos: this.categoriasIngresos,
        categoriasGastos: this.categoriasGastos
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.actualizar) {
      this.cargarPresupuestos();
    }
  }

  async eliminarPresupuesto(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de eliminar este presupuesto?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Eliminar', 
          handler: async () => {
            try {
              // Usando procedimiento existente (asumiendo que existe DELETE_Presupuesto)
              await this.apiService.eliminarPresupuesto(id).toPromise();
              this.mostrarAlerta('Éxito', 'Presupuesto eliminado correctamente');
              this.cargarPresupuestos();
            } catch (error) {
              console.error('Error al eliminar presupuesto:', error);
              this.mostrarAlerta('Error', 'No se pudo eliminar el presupuesto');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}