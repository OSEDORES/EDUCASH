import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-listado-gastos',
  templateUrl: './listado.page.html',
  styleUrls: ['./listado.page.scss'],
  standalone: false,
})
export class ListadoPage implements OnInit {
  gastos: any[] = [];
  gastosFiltrados: any[] = [];
  filtro: string = 'todos';

  constructor(
    private http: HttpClient, 
    private navCtrl: NavController,
    private menu: MenuController) {}

  ngOnInit() {
    this.cargarGastos();
  }

  ionViewWillEnter() {
    this.menu.enable(true); // Habilita el menú al entrar
  }

  ionViewWillLeave() {
    this.menu.enable(false); // Opcional: deshabilita al salir
  }

  cargarGastos() {
    this.http.get('http://localhost:3000/gastos').subscribe((data: any) => {
      this.gastos = data;
      this.filtrarGastos()
    });
  }

  filtrarGastos() {
    if (this.filtro === 'todos') {
      this.gastosFiltrados = [...this.gastos];
    } else if (this.filtro === 'mes') {
      const hoy = new Date();
      this.gastosFiltrados = this.gastos.filter(gasto => {
        const fechaGasto = new Date(gasto.fecha);
        return fechaGasto.getMonth() === hoy.getMonth() && fechaGasto.getFullYear() === hoy.getFullYear();
      });
    }
    // Ordenar por fecha (más reciente primero)
    this.gastosFiltrados.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }

  eliminarGasto(id: number) {
    this.http.delete(`http://localhost:3000/gastos/${id}`).subscribe(() => {
      this.gastos = this.gastos.filter(gasto => gasto.id !== id);
      this.filtrarGastos();
    });
  }

  editarGasto(gasto: any) {
    this.navCtrl.navigateForward(['/gastos/registro', gasto.id]);
  }

  navegarARegistro() {
    this.navCtrl.navigateForward('/gastos/registro');
  }
}