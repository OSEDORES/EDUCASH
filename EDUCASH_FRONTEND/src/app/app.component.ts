import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ApiService } from './services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Inicio', url: '/home', icon: 'home' },
    { title: 'Ingresos', url: '/ingresos/listado', icon: 'cash' },
    { title: 'Gastos', url: '/gastos/listado', icon: 'wallet' },
    { title: 'Presupuestos', url: '/presupuestos', icon: 'pie-chart' },
    { title: 'EDUCA$H Tips', url: '/tips', icon: 'bulb' },
    { title: 'Perfil', url: '/perfil', icon: 'person' }
  ];

  public usuario: any;

  constructor(
    private menu: MenuController,
    public apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.menu.enable(true, 'main-content');
    this.cargarUsuario();
  }

  async logout() {
    await this.apiService.logout(); 
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  get isAuthenticated(): boolean {
    return this.apiService.isAuthenticated; 
  }

  async cargarUsuario() {
    if (this.isAuthenticated) {
      this.apiService.getUsuarioActual().subscribe({
        next: (user) => this.usuario = user,
        error: (err) => console.error('Error al cargar usuario:', err)
      });
    }
  }
}