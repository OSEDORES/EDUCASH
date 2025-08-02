import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MenuController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private usersData = 'assets/data/DataEDUCASH.json';
  private baseUrl = 'http://localhost:3000';
  private _isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    private menu: MenuController
  ) {}

  get isAuthenticated(): boolean {
    return this._isAuthenticated.value;
  }

  async loginUser(credentials: { email: string; password: string }): Promise<boolean> {
    try {
      const data = await this.http.get<any>(this.usersData).toPromise();
      const user = data?.Usuarios?.find((u: any) => 
        u.email === credentials.email && 
        u.password === credentials.password
      );

      this._isAuthenticated.next(!!user);
      if (user) {
        this.menu.enable(true);
        this.router.navigate(['/home']);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error loading users:', error);
      return false;
    }
  }

  logout(): void {
    this._isAuthenticated.next(false);
    this.menu.enable(false);
    this.menu.close();
    this.router.navigate(['/login']);
  }

  getIngresos(): Observable<any[]> {
    return this.http.get<any>(this.usersData).pipe(
      map(data => data.ingresos || [])
    );
  }

  getGastos(): Observable<any[]> {
    return this.http.get<any>(this.usersData).pipe(
      map(data => data.gastos || [])
    );
  }

  getFinancialData(): Observable<any> {
    return this.http.get(this.usersData);
  }

  getIncomes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.usersData}/ingresos`);
  }

  getExpenses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.usersData}/gastos`);
  }

  getCategoriasIngresos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categorias_ingresos`);
  }
  getIngresoPorId(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/ingresos/${id}`);
  }

  crearIngreso(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/ingresos`, data);
  }

  actualizarIngreso(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/ingresos/${id}`, data);
  }
  
  getListaIngresos(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/ingresos');
  }
  
  eliminarIngreso(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:3000/ingresos/${id}`);
  }
  
}