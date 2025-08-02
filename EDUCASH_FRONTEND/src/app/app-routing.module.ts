import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', 
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  // Módulo de Ingresos
  {
    path: 'ingresos',
    children: [
      {
        path: 'listado',
        loadChildren: () => import('./pages/ingresos/listado/listado.module').then(m => m.ListadoPageModule)
      },
      {
        path: 'registro',
        loadChildren: () => import('./pages/ingresos/registro/registro.module').then(m => m.RegistroPageModule)
      }
    ]
  },
  // Módulo de Gastos
  {
    path: 'gastos',
    children: [
      {
        path: 'listado',
        loadChildren: () => import('./pages/gastos/listado/listado.module').then(m => m.ListadoPageModule)
      },
      {
        path: 'registro',
        loadChildren: () => import('./pages/gastos/registro/registro.module').then(m => m.RegistroPageModule)
      }
    ]
  },
  // Otras rutas
  {
    path: 'presupuestos',
    loadChildren: () => import('./pages/presupuestos/presupuestos.module').then(m => m.PresupuestosPageModule)
  },
  {
    path: 'tips',
    loadChildren: () => import('./pages/tips/tips.module').then(m => m.TipsPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then(m => m.PerfilPageModule)
  },
  // Ruta de fallback
  {
    path: '**',
    redirectTo: 'home'
  },
  {
    path: 'config',
    loadChildren: () => import('./pages/config/config.module').then( m => m.ConfigPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}