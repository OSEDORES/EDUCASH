import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ApiService } from '../../services/api.service';
import { MenuController } from '@ionic/angular';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  chart: any;
  
  // Datos financieros
  saldoTotal: number = 0;
  totalIngresos: number = 0;
  totalGastos: number = 0;
  chartPeriod: string = 'month';
  ultimasTransacciones: any[] = [];
  anualIngresos: number = 0;
  anualGastos: number = 0;

  constructor(
    private apiService: ApiService, 
    private menu: MenuController
  ) {}

  ngOnInit() {
    this.loadFinancialData();
  }

  ionViewDidEnter() {
    this.menu.enable(true, 'main');
  }

  ngAfterViewInit() {
    // El gráfico se renderizará después de cargar los datos
  }

  async loadFinancialData() {
    try {
      // Obtener datos del usuario actual
      const userData: any = await this.apiService.getUsuarioActual().toPromise();
      console.log('Datos de usuario cargados en home.page.ts:', userData);
      
      if (!userData?.Id_Usuario) { // Ajusta según el campo que devuelve tu API
        console.error('Usuario no autenticado');
        return;
      }

      // Cargar datos financieros
      const [ingresosRaw, gastosRaw] = await Promise.all([
        this.apiService.getIngresosUsuario(userData.Id_Usuario).toPromise(),
        this.apiService.getGastosUsuario(userData.Id_Usuario).toPromise()
      ]);

      // Mapear datos para que tengan los campos esperados en el template
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

      // Procesar datos
      this.totalIngresos = ingresos.reduce((sum, item) => sum + (item.monto || 0), 0);
      this.totalGastos = gastos.reduce((sum, item) => sum + (item.monto || 0), 0);
      this.saldoTotal = this.totalIngresos - this.totalGastos;
      
      // Preparar últimas transacciones
      this.ultimasTransacciones = [
        ...ingresos.map(i => ({...i, tipo: 'ingreso'})),
        ...gastos.map(g => ({...g, tipo: 'gasto'}))
      ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 5);

      // Renderizar gráfico
      this.renderChart();
      
    } catch (error) {
      console.error('Error al cargar datos:', error);
      // Puedes mostrar un toast al usuario aquí
    }
  }

  private processFinancialData(ingresos: any[], gastos: any[]) {
    this.totalIngresos = ingresos.reduce((sum, item) => sum + (item.monto || 0), 0);
    this.totalGastos = gastos.reduce((sum, item) => sum + (item.monto || 0), 0);
    this.saldoTotal = this.totalIngresos - this.totalGastos;
    
    // Para simplificar, usamos los mismos valores para anual
    this.anualIngresos = this.totalIngresos;
    this.anualGastos = this.totalGastos;
    
    this.prepareLastTransactions(ingresos, gastos);
    this.renderChart();
  }

  private prepareLastTransactions(ingresos: any[], gastos: any[]) {
    const combined = [
      ...ingresos.map(i => ({...i, tipo: 'ingreso'})),
      ...gastos.map(g => ({...g, tipo: 'gasto'}))
    ].sort((a, b) => 
      new Date(b.fecha || 0).getTime() - new Date(a.fecha || 0).getTime()
    ).slice(0, 5);
    
    this.ultimasTransacciones = combined;
  }

  private renderChart() {
    if (this.chart) this.chart.destroy();

    const ctx = this.chartContainer.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Ingresos', 'Gastos'],
        datasets: [{
          data: [this.totalIngresos, this.totalGastos],
          backgroundColor: ['#2dd36f', '#eb445a'],
          borderWidth: 0
        }]
      },
      options: {
        cutout: '75%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed || 0;
                return `${label}: L ${value.toFixed(2)}`;
              }
            }
          }
        }
      }
    });
  }

  updateChart() {
    this.renderChart();
  }

  refreshData() {
    this.loadFinancialData();
  }

  getPorcentajeGastos(): string {
    return (this.totalIngresos > 0 
      ? (this.totalGastos / this.totalIngresos * 100) 
      : 0
    ).toFixed(1);
  }
}