import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, MenuController, LoadingController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

interface CategoriaGasto {
  id: number;
  nom_categoria: string;
  icono: string;
  color: string;
  es_recurrente: boolean;
}

@Component({
  selector: 'app-registro-gastos',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false,
})
export class RegistroPage implements OnInit {
  formGasto: FormGroup;
  categorias: CategoriaGasto[] = [];
  isEditMode = false;
  gastoId: number | null = null;
  cargando = true;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private menu: MenuController,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private apiService: ApiService
  ) {
    this.formGasto = this.fb.group({
      monto: ['', [Validators.required, Validators.min(0.01)]],
      id_categoria: ['', Validators.required],
      fecha: [new Date().toISOString(), Validators.required],
      descripcion: ['', [Validators.maxLength(200)]],
      es_recurrente: [false]
    });
  }
  maxDate = new Date().toISOString();

  async ngOnInit() {
    await this.cargarDatosIniciales();
  }

  async cargarDatosIniciales() {
    this.cargando = true;
    
    try {
      await this.cargarCategorias();
      
      this.gastoId = Number(this.route.snapshot.paramMap.get('id'));
      if (this.gastoId) {
        this.isEditMode = true;
        await this.cargarGastoParaEdicion();
      }
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
      await this.mostrarError('Error al cargar los datos');
    } finally {
      this.cargando = false;
    }
  }

  async cargarCategorias() {
    try {
      const categorias = await this.apiService.getCategoriasGastos().toPromise();
      this.categorias = (categorias || []).map(cat => ({
        id: cat.Id_Categoria_Gasto,
        nom_categoria: cat.Nombre_Categoria_Gasto,
        icono: cat.Icono,
        color: cat.Color,
        es_recurrente: cat.Es_Recurrente || false
      }));
      
      if (this.categorias.length === 0) {
        this.categorias = this.getCategoriasDefault();
      }
    } catch (error) {
      console.error('Error cargando categorías:', error);
      this.categorias = this.getCategoriasDefault();
    }
  }

  private getCategoriasDefault(): CategoriaGasto[] {
    return [
      { id: 1, nom_categoria: 'Comida', icono: 'fast-food-outline', color: '#EB445A', es_recurrente: true },
      { id: 2, nom_categoria: 'Transporte', icono: 'car-outline', color: '#FFC409', es_recurrente: true },
      { id: 3, nom_categoria: 'Entretenimiento', icono: 'game-controller-outline', color: '#2DD36F', es_recurrente: false }
    ];
  }

  async cargarGastoParaEdicion() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando gasto...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const userId = await this.obtenerUserId();
      if (!userId) {
        await loading.dismiss();
        return;
      }

      const gastos = await this.apiService.getGastosUsuario(userId).toPromise();
      const gasto = gastos?.find((g: any) => g.id_transaccion === this.gastoId);

      if (gasto) {
        this.formGasto.patchValue({
          monto: gasto.monto,
          id_categoria: gasto.id_categoria_gasto,
          fecha: gasto.fecha,
          descripcion: gasto.descripcion,
          es_recurrente: gasto.es_recurrente || false
        });
      } else {
        await this.mostrarError('No se encontró el gasto');
        this.navCtrl.navigateBack('/gastos/listado');
      }
      
    } catch (error) {
      console.error('Error cargando gasto:', error);
      await this.mostrarError('Error al cargar el gasto');
    } finally {
      await loading.dismiss();
    }
  }

  async guardarGasto() {
    if (this.formGasto.invalid) {
      await this.mostrarError('Complete todos los campos requeridos');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Guardando gasto...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const userId = await this.obtenerUserId();
      if (!userId) {
        await this.mostrarError('Usuario no identificado');
        return;
      }

      const formData = this.formGasto.value;
      const gastoData = {
        IdUsuario: userId,
        IdCategoriaGasto: formData.id_categoria,
        Monto: parseFloat(formData.monto),
        Fecha: formData.fecha,
        Descripcion: formData.descripcion || '',
        EsRecurrente: formData.es_recurrente
      };

      if (this.isEditMode && this.gastoId) {
        await this.apiService.eliminarGasto(this.gastoId.toString()).toPromise();
        await this.apiService.crearGasto(gastoData).toPromise();
        await this.mostrarExito('Gasto actualizado correctamente');
      } else {
        await this.apiService.crearGasto(gastoData).toPromise();
        await this.mostrarExito('Gasto creado correctamente');
      }

      this.navCtrl.navigateBack('/gastos/listado');
    } catch (error: any) {
      console.error('Error guardando gasto:', error);
      const mensajeBackend = error?.error?.message || '';
      if (mensajeBackend.includes('Has excedido el presupuesto mensual para esta categoría')) {
        await this.mostrarError('Advertencia: Has excedido el presupuesto mensual para esta categoría');
      } else {
        await this.mostrarError('Error al guardar el gasto');
      }
    } finally {
      await loading.dismiss();
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

  getCategoriaSeleccionada() {
    return this.categorias.find(c => c.id === this.formGasto.get('id_categoria')?.value);
  }

  getNombreCategoria(idCategoria: number): string {
    const categoria = this.categorias.find(c => c.id === idCategoria);
    return categoria ? categoria.nom_categoria : 'Sin categoría';
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