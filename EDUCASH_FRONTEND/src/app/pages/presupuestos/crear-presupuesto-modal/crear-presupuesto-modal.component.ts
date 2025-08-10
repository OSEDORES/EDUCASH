import { Component, Input, OnInit } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-crear-presupuesto-modal',
  templateUrl: './crear-presupuesto-modal.component.html',
  styleUrls: ['./crear-presupuesto-modal.component.scss'],
  standalone: false,
})
export class CrearPresupuestoModalComponent implements OnInit {
  @Input() presupuesto: any;
  @Input() userId: number = 0;
  presupuestoForm: FormGroup;
  categorias = ['Alimentación', 'Transporte', 'Ocio', 'Vivienda', 'Ahorros', 'Otros'];
  tipos = ['Gasto', 'Ingreso', 'Ahorro'];
  periodos = ['Mensual', 'Trimestral', 'Anual'];
  esEdicion: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private apiService: ApiService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController
  ) {
    this.presupuestoForm = this.fb.group({
      nombre: ['', Validators.required],
      tipo: ['Gasto', Validators.required],
      periodo: ['Mensual', Validators.required],
      objetivo: [''],
      detalles: this.fb.array([this.crearDetalleGrupo()]) // Inicializa con un detalle
    });
  }

  ngOnInit() {
    if (this.presupuesto) {
      this.esEdicion = true;
      console.log(' Modal en modo edición para presupuesto:', this.presupuesto);
      this.cargarDatosExistente();
    } else {
      console.log(' Modal en modo creación para nuevo presupuesto');
    }
  }

  private cargarDatosExistente() {
    console.log(' Cargando datos existentes del presupuesto:', this.presupuesto);
    
    const detallesArray = this.presupuesto.DetallesPresupuesto.map((detalle: any) => {
      console.log(' Detalle encontrado:', detalle);
      return this.fb.group({
        categoria: [this.mapearIdACategoria(detalle.Id_Categoria), Validators.required],
        monto: [detalle.Monto_Asignado, [Validators.required, Validators.min(0.01)]]
      });
    });

    console.log(' Total de detalles a cargar:', detallesArray.length);

    this.presupuestoForm = this.fb.group({
      nombre: [this.presupuesto.NombrePresupuesto, Validators.required],
      tipo: [this.mapearIdATipo(this.presupuesto.IdTipoPresupuesto), Validators.required],
      periodo: [this.mapearIdAPeriodo(this.presupuesto.IdPeriodo), Validators.required],
      objetivo: [this.presupuesto.Objetivo || ''],
      detalles: this.fb.array(detallesArray)
    });
    
    console.log(' Formulario cargado con datos existentes:', this.presupuestoForm.value);
  }

  get detalles(): FormArray {
    return this.presupuestoForm.get('detalles') as FormArray;
  }

  crearDetalleGrupo(): FormGroup {
    return this.fb.group({
      categoria: ['', Validators.required],
      monto: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  agregarDetalle() {
    this.detalles.push(this.crearDetalleGrupo());
  }

  eliminarDetalle(index: number) {
    if (this.detalles.length > 1) {
      this.detalles.removeAt(index);
    }
  }

  async guardar() {
    if (this.presupuestoForm.valid && this.userId > 0) {
      console.log(' Guardando presupuesto...');
      console.log(' Datos del formulario:', this.presupuestoForm.value);
      
      const loading = await this.loadingCtrl.create({
        message: this.esEdicion ? 'Actualizando...' : 'Creando...'
      });
      await loading.present();

      const formData = this.presupuestoForm.value;
      const presupuestoData = {
        IdUsuario: this.userId,
        NombrePresupuesto: formData.nombre,
        IdTipoPresupuesto: this.mapearTipoPresupuesto(formData.tipo),
        IdPeriodo: this.mapearPeriodo(formData.periodo),
        MontoTotal: this.calcularMontoTotal(formData.detalles),
        Objetivo: formData.objetivo || null,
        DetallesPresupuesto: formData.detalles.map((detalle: any) => ({
          Id_Categoria: this.mapearCategoria(detalle.categoria),
          Monto_Asignado: detalle.monto
        }))
      };

      console.log(' Datos a enviar al servidor:', presupuestoData);

      try {
        const response = this.esEdicion
          ? await this.apiService.actualizarPresupuesto(this.presupuesto.id, presupuestoData).toPromise()
          : await this.apiService.crearPresupuesto(presupuestoData).toPromise();

        console.log(' Respuesta del servidor:', response);
        this.modalCtrl.dismiss({ actualizar: true, data: response });
      } catch (error) {
        console.error(' Error al guardar:', error);
        this.mostrarAlerta('Error', 'No se pudo guardar. Verifica los datos.');
      } finally {
        await loading.dismiss();
      }
    } else {
      console.log(' Formulario inválido o userId no válido:', { 
        valid: this.presupuestoForm.valid, 
        userId: this.userId 
      });
    }
  }

  private calcularMontoTotal(detalles: any[]): number {
    return detalles.reduce((total, detalle) => total + parseFloat(detalle.monto), 0);
  }

  private mapearTipoPresupuesto(tipo: string): number {
    switch (tipo) {
      case 'Gasto': return 1;
      case 'Ingreso': return 2;
      case 'Ahorro': return 3;
      default: return 1; // Default to Gasto
    }
  }

  private mapearPeriodo(periodo: string): number {
    switch (periodo) {
      case 'Mensual': return 1;
      case 'Trimestral': return 2;
      case 'Anual': return 3;
      default: return 1; // Default to Mensual
    }
  }

  private mapearCategoria(categoria: string): number {
    switch (categoria) {
      case 'Alimentación': return 1;
      case 'Transporte': return 2;
      case 'Ocio': return 3;
      case 'Vivienda': return 4;
      case 'Ahorros': return 5;
      case 'Otros': return 6;
      default: return 6; // Default to Otros
    }
  }

  private mapearIdATipo(id: number): string {
    switch (id) {
      case 1: return 'Gasto';
      case 2: return 'Ingreso';
      case 3: return 'Ahorro';
      default: return 'Gasto';
    }
  }

  private mapearIdAPeriodo(id: number): string {
    switch (id) {
      case 1: return 'Mensual';
      case 2: return 'Trimestral';
      case 3: return 'Anual';
      default: return 'Mensual';
    }
  }

  private mapearIdACategoria(id: number): string {
    switch (id) {
      case 1: return 'Alimentación';
      case 2: return 'Transporte';
      case 3: return 'Ocio';
      case 4: return 'Vivienda';
      case 5: return 'Ahorros';
      case 6: return 'Otros';
      default: return 'Otros';
    }
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }

  cancelar() {
    this.modalCtrl.dismiss();
  }
}