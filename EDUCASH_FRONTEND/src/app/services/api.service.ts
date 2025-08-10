import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { MenuController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private _isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    private menu: MenuController,
    private storage: Storage
  ) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create();
    const token = await this.storage.get('authToken');
    if (token) {
      this._isAuthenticated.next(true);
    }
  }

  // ===== AUTENTICACIÓN =====
  async login(credentials: { email: string; password: string }): Promise<boolean> {
    try {
      const response = await this.http.post<any>(`${this.apiUrl}/api/usuarios/auth`, credentials).toPromise();
      
      if (response.Resultado === 'Éxito') {
        await this.storage.set('authToken', 'dummy-token');
        await this.storage.set('userId', response.Id_Usuario);
        this._isAuthenticated.next(true);
        this.menu.enable(true);
        this.router.navigate(['/home']);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  }

  async logout(): Promise<void> {
    await this.storage.remove('authToken');
    await this.storage.remove('userId');
    this._isAuthenticated.next(false);
    this.menu.enable(false);
    this.menu.close();
    this.router.navigate(['/login']);
  }

  // ===== USUARIOS =====
  registrarUsuario(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/usuarios`, userData).pipe(
      catchError(this.handleError)
    );
  }

  getUsuarioActual(): Observable<any> {
    return from(this.storage.get('userId')).pipe(
      switchMap((id: number) => {
        return this.http.get(`${this.apiUrl}/api/usuarios/${id}`).pipe(
          catchError(this.handleError)
        );
      })
    );
  }

  actualizarPerfil(idUsuario: number, updateData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/usuarios/${idUsuario}`, updateData).pipe(
      catchError(this.handleError)
    );
  }

  // ===== TRANSACCIONES =====
  getIngresosUsuario(idUsuario: number, mes?: number, anio?: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/transacciones/ingresos/${idUsuario}`).pipe(
      catchError(this.handleError)
    );
  }

  getGastosUsuario(idUsuario: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/transacciones/gastos/${idUsuario}`).pipe(
      catchError(this.handleError)
    );
  }

  crearIngreso(ingresoData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/transacciones/ingresos`, ingresoData).pipe(
      catchError(this.handleError)
    );
  }

  crearGasto(gastoData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/transacciones/gastos`, gastoData).pipe(
      catchError(this.handleError)
    );
  }

  actualizarIngreso(id: string, ingresoData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/transacciones/ingresos/${id}`, ingresoData).pipe(
      catchError(this.handleError)
    );
  }

  actualizarGasto(id: string, gastoData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/transacciones/gastos/${id}`, gastoData).pipe(
      catchError(this.handleError)
    );
  }

  eliminarIngreso(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/transacciones/ingresos/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  eliminarGasto(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/transacciones/gastos/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // ===== CATEGORÍAS =====
  getCategoriasIngresos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/categorias/ingresos`).pipe(
      catchError(this.handleError)
    );
  }

  getCategoriasGastos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/categorias/gastos`).pipe(
      catchError(this.handleError)
    );
  }

  crearCategoriaIngreso(categoriaData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/categorias/ingresos`, categoriaData).pipe(
      catchError(this.handleError)
    );
  }

  crearCategoriaGasto(categoriaData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/categorias/gastos`, categoriaData).pipe(
      catchError(this.handleError)
    );
  }

  actualizarCategoriaIngreso(id: number, categoriaData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/categorias/ingresos/${id}`, categoriaData).pipe(
      catchError(this.handleError)
    );
  }

  actualizarCategoriaGasto(id: number, categoriaData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/categorias/gastos/${id}`, categoriaData).pipe(
      catchError(this.handleError)
    );
  }

  // ===== PRESUPUESTOS =====
  getPresupuestosUsuario(idUsuario: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/presupuestos/${idUsuario}`).pipe(
      catchError(this.handleError)
    );
  }

  getDetallesPresupuesto(idPresupuesto: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/presupuestos/${idPresupuesto}`).pipe(
      catchError(this.handleError)
    );
  }

  crearPresupuesto(presupuestoData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/presupuestos`, presupuestoData).pipe(
      catchError(this.handleError)
    );
  }

  actualizarPresupuesto(id: number, presupuestoData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/presupuestos/${id}`, presupuestoData).pipe(
      catchError(this.handleError)
    );
  }

  eliminarPresupuesto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/presupuestos/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // ===== RECORDATORIOS =====
  getRecordatoriosUsuario(idUsuario: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/recordatorios`).pipe(
      catchError(this.handleError)
    );
  }

  crearRecordatorio(recordatorioData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/recordatorios`, recordatorioData).pipe(
      catchError(this.handleError)
    );
  }

  // ===== TIPS FINANCIEROS =====
  getTips(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/tips`).pipe(
      catchError(this.handleError)
    );
  }

  getTipDetalle(idTip: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/tips/${idTip}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    let errorMessage = 'Ocurrió un error inesperado';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 401) {
        errorMessage = 'No autorizado. Por favor inicia sesión nuevamente.';
        this.logout();
      } else if (error.status === 404) {
        errorMessage = 'Recurso no encontrado';
      } else if (error.status === 500) {
        errorMessage = 'Error interno del servidor';
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    return throwError(errorMessage);
  }

  get isAuthenticated(): boolean {
    return this._isAuthenticated.value;
  }
}