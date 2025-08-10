import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, LoadingController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements OnInit {
  usuario: any = {};
  estadisticas = {
    totalIngresos: 0,
    totalGastos: 0,
    balance: 0,
    presupuestosActivos: 0
  };
  editMode = false;
  isLoading = true;
  userId: number | null = null;

  constructor(
    private apiService: ApiService,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.initStorage();
    await this.cargarDatos();
  }

  async initStorage() {
    await this.storage.create();
  }

  async cargarDatos() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando perfil...'
    });
    await loading.present();

    try {
      // Obtener userId del storage
      this.userId = await this.storage.get('userId');
      
      if (!this.userId) {
        throw new Error('Usuario no autenticado');
      }

      // Cargar datos del usuario actual
      await this.cargarUsuarioActual();
      
      // Cargar estadísticas del usuario
      await this.cargarEstadisticasUsuario();
      
    } catch (error) {
      console.error('Error cargando datos:', error);
      this.mostrarAlerta('Error al cargar datos del perfil. Por favor, inicia sesión nuevamente.');
      
      // Redirigir al login si no está autenticado
      if (error instanceof Error && error.message === 'Usuario no autenticado') {
        this.router.navigate(['/login'], { replaceUrl: true });
      }
    } finally {
      this.isLoading = false;
      await loading.dismiss();
    }
  }

  async cargarUsuarioActual() {
    if (!this.userId) return;

    try {
      const usuario = await this.apiService.getUsuarioActual().toPromise();
      this.usuario = usuario;
    } catch (error) {
      console.error('Error cargando usuario:', error);
      throw error;
    }
  }

  async cargarEstadisticasUsuario() {
    if (!this.userId) return;

    try {
      const ingresosRaw = await this.apiService.getIngresosUsuario(this.userId).toPromise();
      const gastosRaw = await this.apiService.getGastosUsuario(this.userId).toPromise();

      const ingresos = (ingresosRaw || []).map(i => ({
        monto: i.Monto,
        descripcion: i.Descripcion,
        fecha: i.Fecha,
        ...i
      }));

      const gastos = (gastosRaw || []).map(g => ({
        monto: g.Monto,
        descripcion: g.Descripcion,
        fecha: g.Fecha,
        ...g
      }));

      this.estadisticas.totalIngresos = ingresos.reduce((sum, item) => sum + (item.monto || 0), 0);
      this.estadisticas.totalGastos = gastos.reduce((sum, item) => sum + (item.monto || 0), 0);
      this.estadisticas.balance = this.estadisticas.totalIngresos - this.estadisticas.totalGastos;

      const presupuestos = await this.apiService.getPresupuestosUsuario(this.userId).toPromise();
      this.estadisticas.presupuestosActivos = presupuestos?.length || 0;

    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      this.estadisticas = {
        totalIngresos: 0,
        totalGastos: 0,
        balance: 0,
        presupuestosActivos: 0
      };
    }
  }

  async cambiarPassword() {
    const alert = await this.alertCtrl.create({
      header: 'Cambiar Contraseña',
      inputs: [
        {
          name: 'actual',
          type: 'password',
          placeholder: 'Contraseña actual'
        },
        {
          name: 'nueva',
          type: 'password',
          placeholder: 'Nueva contraseña'
        },
        {
          name: 'confirmar',
          type: 'password',
          placeholder: 'Confirmar nueva contraseña'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            if (!data.actual || !data.nueva || !data.confirmar) {
              this.mostrarAlerta('Todos los campos son requeridos');
              return false;
            }

            if (data.nueva !== data.confirmar) {
              this.mostrarAlerta('Las contraseñas no coinciden');
              return false;
            }

            try {
              const updateData = {
                NombreUsuario: this.usuario.NombreUsuario,
                ClaveActual: data.actual,
                NuevaClave: data.nueva
              };

              await this.apiService.actualizarPerfil(this.usuario.id, updateData).toPromise();
              this.mostrarAlerta('Contraseña actualizada correctamente');
              return true;
            } catch (error) {
              this.mostrarAlerta('Error al actualizar contraseña. Verifique su contraseña actual.');
              return false;
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: 'Información',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  async guardarCambios() {
    if (!this.userId) return;

    const loading = await this.loadingCtrl.create({
      message: 'Guardando cambios...'
    });
    await loading.present();

    try {
      const updateData = {
        NombreUsuario: this.usuario.NombreUsuario,
        FotoPerfil: this.usuario.FotoPerfil
      };

      await this.apiService.actualizarPerfil(this.usuario.id, updateData).toPromise();
      
      this.toggleEditMode();
      this.mostrarAlerta('Perfil actualizado correctamente');
      
    } catch (error) {
      console.error('Error guardando cambios:', error);
      this.mostrarAlerta('Error al guardar los cambios');
    } finally {
      await loading.dismiss();
    }
  }

  async refreshData() {
    await this.cargarDatos();
  }
}
