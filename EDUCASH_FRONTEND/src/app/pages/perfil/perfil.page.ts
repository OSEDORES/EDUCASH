import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController, NavController, LoadingController } from '@ionic/angular';

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

  constructor(
    private http: HttpClient,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
    await this.cargarDatos();
  }

  

  cargarDatosUsuario() {
    this.http.get('http://localhost:3000/Usuarios/1').subscribe({
      next: (data: any) => {
        this.usuario = data;
      },
      error: (err) => {
        console.error('Error cargando usuario:', err);
      }
    });
  }

  async cargarDatos() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando perfil...'
    });
    await loading.present();

    try {
      // Cargar usuario
      const usuarios: any = await this.http.get('http://localhost:3000/Usuarios').toPromise();
      this.usuario = usuarios.find((u: any) => u.id === 1) || usuarios[0];
      
      // Cargar estadísticas
      await this.calcularEstadisticas();
    } catch (error) {
      console.error('Error cargando datos:', error);
      this.mostrarAlerta('Error al cargar datos del perfil');
    } finally {
      this.isLoading = false;
      await loading.dismiss();
    }
  }

  calcularEstadisticas() {
    this.http.get('http://localhost:3000/ingresos').subscribe((ingresos: any) => {
      const totalIngresos = ingresos.reduce((sum: number, item: any) => sum + item.monto, 0);
      
      this.http.get('http://localhost:3000/gastos').subscribe((gastos: any) => {
        const totalGastos = gastos.reduce((sum: number, item: any) => sum + item.monto, 0);
        
        this.estadisticas = {
          totalIngresos,
          totalGastos,
          balance: totalIngresos - totalGastos,
          presupuestosActivos: 1 // Asumiendo que siempre hay 1 presupuesto activo
        };
      });
    });
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
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.actual && data.nueva) {
              // Lógica para actualizar contraseña
              this.http.patch(`http://localhost:3000/Usuarios/${this.usuario.id}`, {
                password: data.nueva
              }).subscribe(() => {
                this.mostrarAlerta('Contraseña actualizada');
              });
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  guardarCambios() {
    this.http.put(`http://localhost:3000/Usuarios/${this.usuario.id}`, this.usuario)
      .subscribe(() => {
        this.toggleEditMode();
        this.mostrarAlerta('Perfil actualizado');
      });
  }
}