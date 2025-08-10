import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, LoadingController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

interface Tip {
  id: number;
  titulo: string;
  icono: string;
  descripcion: string;
  porcentaje?: number;
  categoria?: string;
}

@Component({
  selector: 'app-tips',
  templateUrl: './tips.page.html',
  styleUrls: ['./tips.page.scss'],
  standalone: false,
})
export class TipsPage implements OnInit {
  tips: Tip[] = [];
  tipSeleccionado: Tip | null = null;
  cargando: boolean = true;
  errorCarga: boolean = false;
  terminoBusqueda: string = '';

  constructor(
    private apiService: ApiService,
    private navCtrl: NavController,
    private menu: MenuController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    await this.cargarTips();
  }

  ionViewWillEnter() {
    this.menu.enable(true);
  }

  async cargarTips() {
    this.cargando = true;
    this.errorCarga = false;

    const loading = await this.loadingCtrl.create({
      message: 'Cargando tips...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const tipsData = await this.apiService.getTips().toPromise();
      console.log('Tips cargados:', tipsData);  // Added console.log here
      
      // Mapeo de datos según estructura de tu API
      this.tips = (tipsData || []).map((tip: any) => ({
        id: tip.id_tip !== undefined ? tip.id_tip : tip.id,
        titulo: tip.Titulo || 'Tip financiero',
        icono: tip.Icono || 'bulb-outline',
        descripcion: tip.Definicion || 'Descripción no disponible',
        porcentaje: tip.Porcentaje_Ingresos || 0,
        categoria: tip.categoria || 'General'
      }));

      if (this.tips.length > 0) {
        this.tipSeleccionado = this.tips[0];
      }

    } catch (error) {
      console.error('Error cargando tips:', error);
      this.errorCarga = true;
      await this.mostrarError('Error al cargar los tips');
    } finally {
      await loading.dismiss();
      this.cargando = false;
    }
  }

  seleccionarTip(tip: Tip) {
    this.tipSeleccionado = tip;
  }

  async buscarTips() {
    if (!this.terminoBusqueda) {
      await this.cargarTips();
      return;
    }

    this.cargando = true;
    try {
      const tipsFiltrados = await this.apiService.getTips().toPromise();
      this.tips = (tipsFiltrados || [])
        .filter((tip: any) => 
          tip.titulo.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
          tip.descripcion.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
        )
        .map((tip: any) => ({
          id: tip.id_tip || tip.id,
          titulo: tip.titulo,
          icono: tip.icono,
          descripcion: tip.descripcion
        }));
    } catch (error) {
      console.error('Error buscando tips:', error);
      await this.mostrarError('Error al buscar tips');
    } finally {
      this.cargando = false;
    }
  }

  private async mostrarError(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      color: 'danger',
      position: 'bottom'
    });
    await toast.present();
  }

  async refrescar(event: any) {
    await this.cargarTips();
    event.target.complete();
  }
}