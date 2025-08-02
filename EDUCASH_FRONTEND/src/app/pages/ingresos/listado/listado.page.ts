import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';


interface Categoria {
  id: number;
  nom_categoria: string;
  icono: string;
  color: string;
  es_recurrente?: boolean;
  es_fijo?: boolean;
}

@Component({
  selector: 'app-listado',
  templateUrl: 'listado.page.html',
  styleUrls: ['listado.page.scss'],
  standalone: false,
})
export class ListadoPage implements OnInit {
  ingresos: any[] = [];
  ingresosFiltrados: any[] = [];
  filtro: string = 'todos';
  categorias: any[] = [];


  constructor(
    private http: HttpClient, 
    private navCtrl: NavController, 
    private menu: MenuController,
    private apiService: ApiService) {}

  ngOnInit() {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales() {
    this.apiService.getCategoriasIngresos().subscribe({
      next: (data) => {
        this.categorias = data;
        this.cargarIngresos();
      },
      error: (err) => {
        console.error('Error cargando categorías', err);
        this.categorias = [
          { id: 1, nom_categoria: 'Salario', icono: 'cash-outline', color: '#4CAF50', es_recurrente: true },
          { id: 2, nom_categoria: 'Freelance', icono: 'code-working-outline', color: '#2196F3', es_recurrente: false }
        ];
        this.cargarIngresos();
      }
    });
  }

  cargarIngresos() {
    this.apiService.getListaIngresos().subscribe((data: any) => {
      this.ingresos = data;
      this.filtrarIngresos();
    });
  }

  filtrarIngresos() {
    if (this.filtro === 'todos') {
      this.ingresosFiltrados = [...this.ingresos];
    } else if (this.filtro === 'mes') {
      const hoy = new Date();
      this.ingresosFiltrados = this.ingresos.filter(ingreso => {
        const fechaIngreso = new Date(ingreso.fecha);
        return fechaIngreso.getMonth() === hoy.getMonth() && fechaIngreso.getFullYear() === hoy.getFullYear();
      });
    }
    // Ordenar por fecha (más reciente primero)
    this.ingresosFiltrados.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }

  eliminarIngreso(id: number) {
    this.apiService.eliminarIngreso(id).subscribe(() => {
      this.ingresos = this.ingresos.filter(ingreso => ingreso.id !== id);
      this.filtrarIngresos();
    });
  }

  navigateToRegistro() {
    this.navCtrl.navigateForward('/ingresos/registro');
  }

  ionViewWillEnter() {
    this.menu.enable(true); // Habilita el menú al entrar
  }

  ionViewWillLeave() {
    this.menu.enable(false); // Opcional: deshabilita al salir
  }

  editarIngreso(ingreso: any) {
    // Navega a la página de registro con el ID como parámetro
    this.navCtrl.navigateForward(['/ingresos/registro', ingreso.id]);
  }

  // En listado.page.ts y registro.page.ts
  getColorCategoria(nombreCategoria: string): string {
    const categoria = this.categorias.find(c => c.nom_categoria === nombreCategoria);
    return categoria?.color || '#4CAF50'; // Verde por defecto
  }

  getIconoCategoria(nombreCategoria: string): string {
    const categoria = this.categorias.find(c => c.nom_categoria === nombreCategoria);
    return categoria?.icono || 'wallet-outline';
  }

  esRecurrente(nombreCategoria: string): boolean {
    const categoria = this.categorias.find(c => c.nom_categoria === nombreCategoria);
    return categoria?.es_recurrente || false;
  }

}