import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';

interface CategoriaGasto {
  id: number;
  nom_categoria: string;
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
  fechaActual = new Date().toISOString();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private navCtrl: NavController,
    private menu: MenuController
  ) {
    this.formGasto = this.fb.group({
      monto: ['', [Validators.required, Validators.min(0.01)]],
      categoria: ['', Validators.required],
      fecha: [this.fechaActual, Validators.required],
      descripcion: ['']
    });
  }

  guardarGasto() {
    if (this.formGasto.valid) {
      this.http.post('http://localhost:3000/gastos', this.formGasto.value).subscribe({
        next: () => {
          this.navCtrl.navigateBack('/gastos/listado');
        },
        error: (err) => {
          console.error('Error guardando gasto', err);
        }
      });
    }
  }

  ngOnInit() {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.http.get<CategoriaGasto[]>('http://localhost:3000/categorias_gastos').subscribe(
      (data) => {
        this.categorias = data;
      },
      (error) => {
        console.error('Error cargando categorías', error);
        this.categorias = [
          { id: 1, nom_categoria: '---' },
          { id: 2, nom_categoria: '---' },
          { id: 3, nom_categoria: '---' }
        ];
      }
    );
  }

  ionViewWillEnter() {
    this.menu.enable(true); // Habilita el menú al entrar
  }

  ionViewWillLeave() {
    this.menu.enable(false); // Opcional: deshabilita al salir
  }
}