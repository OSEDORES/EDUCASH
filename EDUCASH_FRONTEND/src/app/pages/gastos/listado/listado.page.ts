import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, LoadingController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

interface Gasto {
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

interface CategoriaGasto {
  id: number;
  nom_categoria: string;
  icono: string;
  color: string;
}

@Component({
  selector: 'app-listado-gastos',
  templateUrl: './listado.page.html',
  styleUrls: ['./listado.page.scss'],
  standalone: false,
})
export class ListadoPage implements OnInit {
  gastos: Gasto[] = [];
  gastosFiltrados: Gasto[] = [];
  categorias: CategoriaGasto[] = [];
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

    const loading = await this.loadingCtrl.create({
      message: 'Cargando gastos...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const userId = await this.obtenerUserId();
      if (!userId) {
        await loading.dismiss();
        return;
      }

      const [gastosData, categoriasData] = await Promise.all([
        this.apiService.getGastosUsuario(userId).toPromise(),
        this.apiService.getCategoriasGastos().toPromise()
      ]);

      console.log('Datos de gastos cargados:', gastosData);
      console.log('Datos de categorías cargados:', categoriasData);

      this.categorias = (categoriasData || []).map(cat => ({
        id: cat.Id_Categoria_Gasto,
        nom_categoria: cat.Nombre_Categoria_Gasto,
        icono: cat.Icono,
        color: cat.Color
      }));
      this.gastos = this.mapearGastos(gastosData || []);
      this.filtrarGastos();

      await loading.dismiss();
    } catch (error) {
      console.error('Error cargando datos:', error);
      this.errorCarga = true;
      await this.mostrarError('Error al cargar los gastos');
      await loading.dismiss();
    } finally {
      this.cargando = false;
    }
  }

  private mapearGastos(data: any[]): Gasto[] {
    return data.map(gasto => {
      return {
        id: gasto.Id_Gasto || 0,
        monto: parseFloat(gasto.Monto) || 0,
        fecha: gasto.Fecha || new Date().toISOString(),
        descripcion: gasto.Descripcion || 'Sin descripción',
        id_categoria: gasto.Id_Categoria_Gasto || 0,
        es_recurrente: gasto.Es_Recurrente || false,
        categoria_nombre: gasto.Nombre_Categoria_Gasto,
        categoria_icono: gasto.Icono,
        categoria_color: gasto.Color
      };
    });
  }

  private obtenerCategoria(id: number): CategoriaGasto | undefined {
    return this.categorias.find(c => c.id === id);
  }

  filtrarGastos() {
    let filtrados = [...this.gastos];

    if (this.filtro === 'mes') {
      const hoy = new Date();
      filtrados = filtrados.filter(gasto => {
        const fechaGasto = new Date(gasto.fecha);
        return fechaGasto.getMonth() === hoy.getMonth() && 
               fechaGasto.getFullYear() === hoy.getFullYear();
      });
    } else if (this.filtro === 'categoria' && this.categoriaFiltro !== 'todas') {
      filtrados = filtrados.filter(gasto => gasto.id_categoria === this.categoriaFiltro);
    }

    this.gastosFiltrados = this.ordenarPorFecha(filtrados);
  }

  private ordenarPorFecha(gastos: Gasto[]): Gasto[] {
    return [...gastos].sort((a, b) => {
      const fechaA = a.fecha ? new Date(a.fecha).getTime() : 0;
      const fechaB = b.fecha ? new Date(b.fecha).getTime() : 0;
      return fechaB - fechaA;
    });
  }

  async eliminarGasto(id: number) {
    const loading = await this.loadingCtrl.create({
      message: 'Eliminando gasto...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      await this.apiService.eliminarGasto(id.toString()).toPromise();
      this.gastos = this.gastos.filter(gasto => gasto.id !== id);
      this.filtrarGastos();
      await this.mostrarExito('Gasto eliminado correctamente');
    } catch (error) {
      console.error('Error eliminando gasto:', error);
      await this.mostrarError('Error al eliminar el gasto');
    } finally {
      await loading.dismiss();
    }
  }

  // Métodos de navegación
  navigateToRegistro() {
    this.navCtrl.navigateForward('/gastos/registro');
  }

  editarGasto(gasto: Gasto) {
    this.navCtrl.navigateForward(['/gastos/registro', gasto.id]);
  }

  // Métodos de UI
  getColorCategoria(categoriaId: number | string): string {
  if (typeof categoriaId === 'string') {
    return categoriaId; // 'primary' es un string válido para color
  }
  // Lógica para obtener color basado en ID numérico
  return 'primary'; // valor por defecto
}

  getIconoCategoria(idCategoria: number): string {
    const categoria = this.categorias.find(c => c.id === idCategoria);
    return categoria?.icono || 'card-outline';
  }

  getNombreCategoria(idCategoria: number): string {
    const categoria = this.categorias.find(c => c.id === idCategoria);
    return categoria?.nom_categoria || 'General';
  }

  // Métodos auxiliares
  private async obtenerUserId(): Promise<number> {
    try {
      const userData: any = await this.apiService.getUsuarioActual().toPromise();
      return userData?.Id_Usuario || 0;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return 0;
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

  private async mostrarExito(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
  }

  ionViewWillEnter() {
    this.menu.enable(true);
  }
}