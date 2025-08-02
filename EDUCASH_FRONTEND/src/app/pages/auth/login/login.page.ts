import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
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

  constructor(
    private apiService: ApiService,  // Nombre correcto del servicio
    private router: Router,
    private menu: MenuController
  ) {}

  ngOnInit() {
    this.menu.enable(false); // Deshabilita el menú al iniciar
  }

  ionViewWillEnter() {
    this.menu.enable(false); // Deshabilita el menú al entrar a la página
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = {
        email: this.loginForm.value.email ?? '',
        password: this.loginForm.value.password ?? ''
      };
  
      this.apiService.loginUser(credentials).then(success => {
        if (success) {
          this.router.navigate(['/home']); // Redirige al home
        } else {
          alert('Credenciales incorrectas'); // Feedback al usuario
        }
      });
    }
  }
}