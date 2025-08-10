import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, MenuController, LoadingController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';


interface CategoriaIngreso {
  id: number;
  nom_categoria: string;
  icono: string;
  color: string;
  es_recurrente: boolean;
}

@Component({
  selector: 'app-registro',
  templateUrl: 'registro.page.html',
  styleUrls: ['registro.page.scss'],
  standalone: false,
})
export class RegistroPage implements OnInit {
  formIngreso: FormGroup;
  categorias: CategoriaIngreso[] = [];
  isEditMode = false;
  ingresoId: number | null = null;
  cargando = true;

  maxDate = new Date().toISOString();

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private menu: MenuController,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private apiService: ApiService
  ) {
    this.formIngreso = this.fb.group({
      monto: ['', [Validators.required, Validators.min(0.01)]],
      id_categoria: ['', Validators.required],
      fecha: [new Date().toISOString(), Validators.required],
      descripcion: ['', [Validators.maxLength(200)]],
      es_recurrente: [false]
    });
  }

  async ngOnInit() {
    await this.cargarDatosIniciales();
  }

  async cargarDatosIniciales() {
    this.cargando = true;
    
    try {
      // Cargar categorías primero
      await this.cargarCategorias();
      
      // Verificar si es edición
      this.ingresoId = Number(this.route.snapshot.paramMap.get('id'));
      if (this.ingresoId) {
        this.isEditMode = true;
        await this.cargarIngresoParaEdicion();
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
      const categorias = await this.apiService.getCategoriasIngresos().toPromise();
      console.log('Categorías de ingresos cargadas:', categorias);
      this.categorias = (categorias || []).map(cat => ({
        id: cat.Id_Categoria_Ingreso,
        nom_categoria: cat.Nombre_Categoria_Ingreso,
        icono: cat.Icono,
        color: cat.Color,
        es_recurrente: cat.Es_Recurrente || false
      }));
      
      // Si el form control está vacío, asignar el primer id para que el formulario sea válido
      if (!this.formIngreso.get('id_categoria')?.value && this.categorias.length > 0) {
        this.formIngreso.get('id_categoria')?.setValue(this.categorias[0].id.toString());
      }
      
      if (this.categorias.length === 0) {
        this.categorias = this.getCategoriasDefault();
      }
    } catch (error) {
      console.error('Error cargando categorías:', error);
      this.categorias = this.getCategoriasDefault();
    }
  }

  private getCategoriasDefault(): CategoriaIngreso[] {
    return [
      { id: 1, nom_categoria: 'Salario', icono: 'cash-outline', color: '#4CAF50', es_recurrente: true },
      { id: 2, nom_categoria: 'Freelance', icono: 'briefcase-outline', color: '#2196F3', es_recurrente: false },
      { id: 3, nom_categoria: 'Inversiones', icono: 'trending-up-outline', color: '#FF9800', es_recurrente: false }
    ];
  }

  async cargarIngresoParaEdicion() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando ingreso...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      // SOLUCIÓN: Usar getIngresosUsuario y filtrar por ID
      const userId = await this.obtenerUserId();
      if (!userId) {
        await loading.dismiss();
        return;
      }

      const ingresos = await this.apiService.getIngresosUsuario(userId).toPromise();
      const ingreso = ingresos?.find((i: any) => i.id_transaccion === this.ingresoId);

      if (ingreso) {
        this.formIngreso.patchValue({
          monto: ingreso.monto,
          id_categoria: ingreso.id_categoria_ingreso,
          fecha: ingreso.fecha,
          descripcion: ingreso.descripcion,
          es_recurrente: ingreso.es_recurrente || false
        });
      } else {
        await this.mostrarError('No se encontró el ingreso');
        this.navCtrl.navigateBack('/ingresos/listado');
      }
      
    } catch (error) {
      console.error('Error cargando ingreso:', error);
      await this.mostrarError('Error al cargar el ingreso');
    } finally {
      await loading.dismiss();
    }
  }

  async guardarIngreso() {
    if (this.formIngreso.invalid) {
      await this.mostrarError('Complete todos los campos requeridos');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Guardando ingreso...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const userId = await this.obtenerUserId();
      console.log('UserId obtenido:', userId);
      if (!userId) {
        await this.mostrarError('Usuario no identificado');
        return;
      }

      const formData = this.formIngreso.value;
      const ingresoData = {
        IdUsuario: userId,
        IdCategoriaIngreso: formData.id_categoria,
        Monto: parseFloat(formData.monto),
        Fecha: formData.fecha,
        Descripcion: formData.descripcion || '',
        EsRecurrente: formData.es_recurrente
      };
      console.log('Datos enviados para crear ingreso:', ingresoData);

      if (this.isEditMode && this.ingresoId) {
        // Usar el método existente eliminarIngreso y crearIngreso como alternativa
        await this.apiService.eliminarIngreso(this.ingresoId.toString()).toPromise();
        await this.apiService.crearIngreso(ingresoData).toPromise();
        await this.mostrarExito('Ingreso actualizado correctamente');
      } else {
        await this.apiService.crearIngreso(ingresoData).toPromise();
        await this.mostrarExito('Ingreso creado correctamente');
      }

      this.navCtrl.navigateBack('/ingresos/listado');
    } catch (error) {
      console.error('Error guardando ingreso:', error);
      await this.mostrarError('Error al guardar el ingreso');
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
    return this.categorias.find(c => c.id === this.formIngreso.get('id_categoria')?.value);
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