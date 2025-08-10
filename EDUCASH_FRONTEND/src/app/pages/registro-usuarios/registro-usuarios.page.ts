import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registro-usuarios',
  templateUrl: './registro-usuarios.page.html',
  styleUrls: ['./registro-usuarios.page.scss'],
  standalone: false,
})
export class RegistroUsuariosPage {
  registroForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private alertController: AlertController
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

  async registrar() {
    if (this.registroForm.invalid) {
      this.mostrarAlerta('Error', 'Por favor completa todos los campos correctamente.');
      return;
    }

    this.isLoading = true;
    
    try {
      const usuarioData = {
        NombreUsuario: this.registroForm.value.nombre,
        Email: this.registroForm.value.email,
        Clave: this.registroForm.value.password
      };

      this.apiService.registrarUsuario(usuarioData).subscribe(
        async (response: any) => {
          if (response && response.Resultado === 'Éxito') {
            await this.mostrarAlerta('Registro exitoso', 'Tu cuenta ha sido creada correctamente.');
            this.router.navigate(['/login']);
          } else {
            const mensaje = response?.Mensaje || 'Ocurrió un error durante el registro';
            this.mostrarAlerta('Error', mensaje);
          }
          this.isLoading = false;
        },
        async (error) => {
          console.error('Error en registro:', error);
          await this.mostrarAlerta('Error', 'Ocurrió un error al registrar el usuario. Por favor intenta nuevamente.');
          this.isLoading = false;
        }
      );
    } catch (error) {
      console.error('Error inesperado:', error);
      this.mostrarAlerta('Error', 'Ocurrió un error inesperado.');
      this.isLoading = false;
    }
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    
    await alert.present();
  }
}