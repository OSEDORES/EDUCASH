import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, LoadingController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';


interface Ingreso {
  id: number;
  monto: number;
  fecha: string;
  descripcion: string;
  id_categoria: number;
  es_recurrente: boolean;
  categoria_nombre?: string;
  categoria_icono?: string;
  categoria_color?: string;
}

interface CategoriaIngreso {
  id: number;
  nom_categoria: string;
  icono: string;
  color: string;
}

@Component({
  selector: 'app-listado',
  templateUrl: 'listado.page.html',
  styleUrls: ['listado.page.scss'],
  standalone: false,
})
export class ListadoPage implements OnInit {
   ingresos: Ingreso[] = [];
  ingresosFiltrados: Ingreso[] = [];
  categorias: CategoriaIngreso[] = [];
  filtro: string = 'todos';
  categoriaFiltro: number | 'todas' = 'todas';
  cargando: boolean = true;
  errorCarga: boolean = false;

  constructor(
    private navCtrl: NavController,
    private menu: MenuController,
    private apiService: ApiService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    await this.cargarDatosIniciales();
  }

  async cargarDatosIniciales() {
    this.cargando = true;
    this.errorCarga = false;

    try {
      const loading = await this.loadingCtrl.create({
        message: 'Cargando ingresos...',
        spinner: 'crescent'
      });
      await loading.present();

      const userId = await this.obtenerUserId();
      if (!userId) {
        await loading.dismiss();
        return;
      }

      // Cargar categorías primero para asegurar que estén disponibles antes de mapear ingresos
      const categoriasData = await this.apiService.getCategoriasIngresos().toPromise();
      this.categorias = (categoriasData || []).map(cat => ({
        id: cat.Id_Categoria_Ingreso,
        nom_categoria: cat.Nombre_Categoria_Ingreso,
        icono: cat.Icono,
        color: cat.Color
      }));

      const ingresosData = await this.apiService.getIngresosUsuario(userId).toPromise();
      console.log('Datos de ingresos cargados:', ingresosData);
      this.ingresos = this.mapearIngresos(ingresosData || []);
      this.filtrarIngresos();

      await loading.dismiss();
    } catch (error) {
      console.error('Error cargando datos:', error);
      this.errorCarga = true;
      await this.mostrarError('Error al cargar los ingresos');
    } finally {
      this.cargando = false;
    }
  }

  private async obtenerUserId(): Promise<number> {
    try {
      const userData: any = await this.apiService.getUsuarioActual().toPromise();
      return userData?.Id_Usuario || 0;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return 0;
    }
  }

  private mapearIngresos(data: any[]): Ingreso[] {
    return data.map(ingreso => {
      const categoria = this.obtenerCategoria(ingreso.Id_Categoria_Ingreso);
      
      return {
        id: ingreso.Id_Ingreso || 0,
        monto: parseFloat(ingreso.Monto) || 0,
        fecha: ingreso.Fecha || new Date().toISOString(),
        descripcion: ingreso.Descripcion || 'Sin descripción',
        id_categoria: ingreso.Id_Categoria_Ingreso || 0,
        es_recurrente: ingreso.Es_Recurrente || false,
        categoria_nombre: categoria?.nom_categoria,
        categoria_icono: categoria?.icono,
        categoria_color: categoria?.color
      };
    });
  }

  private obtenerCategoria(id: number): CategoriaIngreso | undefined {
    return this.categorias.find(c => c.id === id);
  }

  filtrarIngresos() {
    let filtrados = [...this.ingresos];

    if (this.filtro === 'mes') {
      const hoy = new Date();
      filtrados = filtrados.filter(ingreso => {
        const fechaIngreso = new Date(ingreso.fecha);
        return fechaIngreso.getMonth() === hoy.getMonth() && 
               fechaIngreso.getFullYear() === hoy.getFullYear();
      });
    } else if (this.filtro === 'categoria' && this.categoriaFiltro !== 'todas') {
      filtrados = filtrados.filter(ingreso => ingreso.id_categoria === this.categoriaFiltro);
    }

    this.ingresosFiltrados = this.ordenarPorFecha(filtrados);
  }

  private ordenarPorFecha(ingresos: Ingreso[]): Ingreso[] {
    return [...ingresos].sort((a, b) => {
      const fechaA = a.fecha ? new Date(a.fecha).getTime() : 0;
      const fechaB = b.fecha ? new Date(b.fecha).getTime() : 0;
      return fechaB - fechaA;
    });
  }

  async eliminarIngreso(id: number) {
    const loading = await this.loadingCtrl.create({
      message: 'Eliminando ingreso...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      await this.apiService.eliminarIngreso(id.toString()).toPromise();
      this.ingresos = this.ingresos.filter(ingreso => ingreso.id !== id);
      this.filtrarIngresos();
      await this.mostrarExito('Ingreso eliminado correctamente');
    } catch (error) {
      console.error('Error eliminando ingreso:', error);
      await this.mostrarError('Error al eliminar el ingreso');
    } finally {
      await loading.dismiss();
    }
  }

  // Métodos de navegación
  navigateToRegistro() {
    this.navCtrl.navigateForward('/ingresos/registro');
  }

  editarIngreso(ingreso: Ingreso) {
    this.navCtrl.navigateForward(['/ingresos/registro', ingreso.id]);
  }

  // Métodos de UI
  getColorCategoria(idCategoria: number): string {
    const categoria = this.categorias.find(c => c.id === idCategoria);
    return categoria?.color || '#4CAF50';
  }

  getIconoCategoria(idCategoria: number): string {
    const categoria = this.categorias.find(c => c.id === idCategoria);
    return categoria?.icono || 'wallet-outline';
  }

  getNombreCategoria(idCategoria: number): string {
    const categoria = this.categorias.find(c => c.id === idCategoria);
    return categoria?.nom_categoria || 'General';
  }

  // Control del menú
  ionViewWillEnter() {
    this.menu.enable(true);
  }

  // Métodos de feedback
  private async mostrarError(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      color: 'danger',
      position: 'bottom'
    });
    await toast.present();
  }

  private async mostrarExito(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
  }
}