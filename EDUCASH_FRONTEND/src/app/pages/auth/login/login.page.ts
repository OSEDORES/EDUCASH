import { Component, OnInit } from '@angular/core';
import { MenuController, ToastController, LoadingController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });
  
  loading = false;
  showPassword = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private menu: MenuController,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.menu.enable(false);
  }

  ionViewWillEnter() {
    this.menu.enable(false);
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Iniciando sesión...',
        spinner: 'crescent'
      });
      await loading.present();

      const credentials = {
        email: this.loginForm.value.email ?? '',
        password: this.loginForm.value.password ?? ''
      };

      console.log('Datos enviados para login:', credentials);

      try {
        const success = await this.apiService.login(credentials); // Cambiado a login
        if (success) {
          await loading.dismiss();
          this.showToast('¡Bienvenido!', 'success');
          this.router.navigate(['/home'], { replaceUrl: true });
        } else {
          await loading.dismiss();
          this.showToast('Credenciales incorrectas', 'danger');
        }
      } catch (error) {
        await loading.dismiss();
        this.showToast('Error al conectar con el servidor', 'danger');
        console.error('Error login:', error);
      }
    } else {
      this.showToast('Por favor, complete todos los campos correctamente', 'warning');
    }
  }

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  navigateToForgotPassword() {
    this.router.navigate(['/recuperar-usuarios']);
  }
}
