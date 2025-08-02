import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MenuController } from '@ionic/angular';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, AfterViewInit {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef<HTMLCanvasElement>;
  chart: any;
  
  // Variables para almacenar datos reales
  saldoTotal: number = 0;
  totalIngresos: number = 0;
  totalGastos: number = 0;
  chartPeriod: string = 'month';
  ultimasTransacciones: any[] = [];
  anualIngresos: number = 0;
  anualGastos: number = 0;

  constructor(private apiService: ApiService, private menu: MenuController) {}

  ngOnInit() {
    this.loadFinancialData();
  }

  ionViewDidEnter() {
    this.menu.enable(true, 'main'); // ¡Este ID debe coincidir con el menuId!
  }

  ngAfterViewInit() {
    // El gráfico se renderizará después de cargar los datos
  }

  loadFinancialData() {
    this.apiService.getFinancialData().subscribe(data => {
      // Calcular totales
      this.totalIngresos = data.ingresos.reduce((sum: number, item: any) => sum + item.monto, 0);
      this.totalGastos = data.gastos.reduce((sum: number, item: any) => sum + item.monto, 0);
      this.saldoTotal = this.totalIngresos - this.totalGastos;
      // Calcular totales mensuales
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      this.totalIngresos = data.ingresos.reduce((sum: number, item: any) => sum + item.monto, 0);

      this.totalGastos = data.gastos.reduce((sum: number, item: any) => sum + item.monto, 0);

       // Calcular totales anuales
        this.anualIngresos = data.ingresos.reduce((sum: number, item: any) => sum + item.monto, 0);
        
      this.anualGastos = data.gastos.reduce((sum: number, item: any) => sum + item.monto, 0);
      
      this.saldoTotal = this.totalIngresos - this.totalGastos;

      // Preparar últimas transacciones (combinar ingresos y gastos)
      const allTransactions = [
        ...data.ingresos.map((i: any) => ({ ...i, tipo: 'ingreso' })),
        ...data.gastos.map((g: any) => ({ ...g, tipo: 'gasto' }))
      ];
      
      // Ordenar por fecha (más recientes primero) y tomar las últimas 5
      this.ultimasTransacciones = allTransactions
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        .slice(0, 5);

      // Renderizar gráfico con datos reales
      this.renderChart();
    });
  }


  renderChart() {
    if (this.chart) {
      this.chart.destroy();
    }
  
    // Verificación adicional del contexto
    const ctx = this.chartContainer?.nativeElement?.getContext('2d');
    if (!ctx) {
      console.error('No se pudo obtener el contexto del canvas');
      return;
    }
  
    // Conversión de tipo explícita
    const chartContainerElement = this.chartContainer.nativeElement as HTMLCanvasElement;
    
    this.chart = new Chart(chartContainerElement, {  // Usamos el elemento directamente
      type: 'doughnut',
      data: {
        labels: ['Ingresos', 'Gastos'],
        datasets: [{
          data: [
            this.chartPeriod === 'month' ? this.totalIngresos : this.anualIngresos,
            this.chartPeriod === 'month' ? this.totalGastos : this.anualGastos
          ],
          backgroundColor: [
            '#2dd36f', // Verde
            '#eb445a'  // Rojo
          ],
          borderWidth: 0
        }]
      },
      options: {
        cutout: '75%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              padding: 20
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: L ${value.toFixed(2)} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  updateChart() {
    if (this.chart) {
      this.chart.destroy();
      this.renderChart();
    }
  }

  refreshData() {
    this.loadFinancialData();
  }

  getPorcentajeGastos(): string {
    const ingresos = this.chartPeriod === 'month' ? this.totalIngresos : this.anualIngresos;
    const gastos = this.chartPeriod === 'month' ? this.totalGastos : this.anualGastos;
    return (ingresos > 0 ? (gastos / ingresos * 100) : 0).toFixed(1);
  }
}