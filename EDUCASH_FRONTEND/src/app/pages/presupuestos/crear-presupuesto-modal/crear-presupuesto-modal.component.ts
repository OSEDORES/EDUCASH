import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-crear-presupuesto-modal',
  templateUrl: './crear-presupuesto-modal.component.html',
  styleUrls: ['./crear-presupuesto-modal.component.scss'],
  standalone: false,
})
export class CrearPresupuestoModalComponent implements OnInit {
  @Input() presupuesto: any; // Recibe el presupuesto a editar (si existe)
  presupuestoForm: FormGroup;
  categorias = ['Alimentación', 'Transporte', 'Ocio', 'Vivienda', 'Ahorros', 'Otros'];
  tipos = ['Gasto', 'Ingreso', 'Ahorro'];
  periodos = ['Mensual', 'Trimestral', 'Anual'];
  esEdicion: boolean = false; // Bandera para saber si estamos editando

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private navCtrl: NavController,
    private menu: MenuController
  ) {
    this.presupuestoForm = this.fb.group({
      nombre: ['', Validators.required],
      categoria: ['', Validators.required],
      tipo: ['Gasto', Validators.required],
      montoTotal: ['', [Validators.required, Validators.min(0.01)]],
      periodo: ['Mensual', Validators.required],
      objetivo: ['']
    });
  }

  ngOnInit() {
    if (this.presupuesto) {
      this.esEdicion = true;
      // Rellena el formulario con los datos existentes
      this.presupuestoForm.patchValue({
        nombre: this.presupuesto.nombre,
        categoria: this.presupuesto.categoria,
        tipo: this.presupuesto.tipo,
        montoTotal: this.presupuesto.montoTotal,
        periodo: this.presupuesto.periodo,
        objetivo: this.presupuesto.objetivo || ''
      });
    }
  }

  cancelar() {
    this.modalCtrl.dismiss();
  }

  guardar() {
    if (this.presupuestoForm.valid) {
      const presupuestoData = {
        ...this.presupuestoForm.value,
        montoUsado: this.esEdicion ? this.presupuesto.montoUsado : 0 // Mantenemos el montoUsado si es edición
      };

      // Si es edición, mantenemos el ID original; si es nuevo, generamos uno
      const nuevoPresupuesto = this.esEdicion 
        ? { ...this.presupuesto, ...presupuestoData }
        : { id: Date.now(), ...presupuestoData };

      // Obtener datos existentes
      const presupuestosGuardados = JSON.parse(localStorage.getItem('presupuestos') || '[]');

      if (this.esEdicion) {
        // Actualizar presupuesto existente
        const index = presupuestosGuardados.findIndex((p: any) => p.id === this.presupuesto.id);
        if (index !== -1) {
          presupuestosGuardados[index] = nuevoPresupuesto;
        }
      } else {
        // Agregar nuevo presupuesto
        presupuestosGuardados.push(nuevoPresupuesto);
      }

      // Guardar en localStorage
      localStorage.setItem('presupuestos', JSON.stringify(presupuestosGuardados));

      // Cerrar modal y enviar datos
      this.modalCtrl.dismiss(nuevoPresupuesto);
    }
  }

  ionViewWillEnter() {
    this.menu.enable(true); // Habilita el menú al entrar
  }

  ionViewWillLeave() {
    this.menu.enable(false); // Opcional: deshabilita al salir
  }
}