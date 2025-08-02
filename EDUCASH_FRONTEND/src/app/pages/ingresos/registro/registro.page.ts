import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavController, MenuController, AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';


interface Categoria {
  id: number;
  nom_categoria: string;
  icono: string;
  color: string;
  es_recurrente: boolean;
  descripcion?: string;
}

@Component({
  selector: 'app-registro',
  templateUrl: 'registro.page.html',
  styleUrls: ['registro.page.scss'],
  standalone: false,
})
export class RegistroPage implements OnInit {
  formIngreso: FormGroup;
  categorias: Categoria[] = [];
  isEditMode = false;
  ingresoId: number | null = null;
  categoriasCargadas = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private navCtrl: NavController,
    private menu: MenuController,
    private activatedRoute: ActivatedRoute,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private api: ApiService,

  ) {
    this.formIngreso = this.fb.group({
      monto: ['', [Validators.required, Validators.min(0.01)]],
      categoria: ['', Validators.required],
      fecha: [new Date().toISOString(), Validators.required],
      descripcion: ['', [Validators.maxLength(200)]],
      es_recurrente: [false]
    });
  }

  ngOnInit() {
    this.cargarCategorias();
    this.ingresoId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    
    if (this.ingresoId) {
      this.isEditMode = true;
      this.cargarIngresoParaEdicion(this.ingresoId);
    }

    // Escuchar cambios en la categoría para actualizar recurrentes
    this.formIngreso.get('categoria')?.valueChanges.subscribe(val => {
      this.actualizarRecurrente();
    });
  }

  cargarCategorias() {
    this.api.getCategoriasIngresos().subscribe({
      next: (data) => {
        this.categorias = data;
        this.categoriasCargadas = true;
        
        // Si es edición y no hay categoría seleccionada, seleccionar primera
        if (this.isEditMode && !this.formIngreso.get('categoria')?.value) {
          this.formIngreso.get('categoria')?.setValue(this.categorias[0]?.nom_categoria);
        }
      },
      error: (err) => {
        console.error('Error cargando categorías', err);
        this.categorias = this.getCategoriasDefault();
        this.categoriasCargadas = true;
      }
    });
  }

  getCategoriasDefault(): Categoria[] {
    return [
      { id: 1, nom_categoria: 'Salario', icono: 'cash-outline', color: '#4CAF50', es_recurrente: true },
      { id: 2, nom_categoria: 'Freelance', icono: 'code-working-outline', color: '#2196F3', es_recurrente: false },
      { id: 3, nom_categoria: 'Bonos', icono: 'gift-outline', color: '#FFC107', es_recurrente: false }
    ];
  }

  actualizarRecurrente() {
    const categoriaSeleccionada = this.categorias.find(
      cat => cat.nom_categoria === this.formIngreso.get('categoria')?.value
    );
    
    if (categoriaSeleccionada) {
      this.formIngreso.get('es_recurrente')?.setValue(categoriaSeleccionada.es_recurrente);
    }
  }

  cargarIngresoParaEdicion(id: number) {
    this.api.getIngresoPorId(id).subscribe({
      next: (ingreso: any) => {
        this.formIngreso.patchValue({
          monto: ingreso.monto,
          categoria: ingreso.categoria,
          fecha: ingreso.fecha,
          descripcion: ingreso.descripcion,
          es_recurrente: ingreso.es_recurrente || false
        });
      },
      error: (err) => {
        console.error('Error cargando ingreso', err);
        this.mostrarAlerta('Error al cargar el ingreso para edición');
      }
    });
  }

  async guardarIngreso() {
    if (this.formIngreso.invalid) {
      this.mostrarAlerta('Por favor complete todos los campos requeridos');
      return;
    }
    const ingresoData = this.formIngreso.value;
    const operacion = this.isEditMode ?

    this.api.actualizarIngreso(this.ingresoId!, ingresoData) :
    this.api.crearIngreso(ingresoData);

    const loading = await this.mostrarLoading();
    
    operacion.subscribe({
      next: () => {
        loading.dismiss();
        this.mostrarAlerta(this.isEditMode ? 'Ingreso actualizado!' : 'Ingreso creado!');
        this.navCtrl.navigateBack('/ingresos/listado');
      },
      error: (err) => {
        loading.dismiss();
        console.error('Error guardando ingreso', err);
        this.mostrarAlerta('Error al guardar: ' + (err.error?.message || err.message));
      }
    });
  }

  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  async mostrarLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Guardando...',
      spinner: 'crescent',
      translucent: true
    });
    await loading.present();
    return loading;
  }

  getColorCategoria(nombreCategoria: string): string {
    const categoria = this.categorias.find(c => c.nom_categoria === nombreCategoria);
    return categoria?.color || '#4CAF50';
  }

  getIconoCategoria(nombreCategoria: string): string {
    const categoria = this.categorias.find(c => c.nom_categoria === nombreCategoria);
    return categoria?.icono || 'wallet-outline';
  }

  ionViewWillEnter() {
    this.menu.enable(true);
  }

  ionViewWillLeave() {
    this.menu.enable(false);
  }
}