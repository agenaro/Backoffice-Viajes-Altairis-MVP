import { Component, OnInit, inject, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardStats } from '../../core/models/dashboard.model';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressBarModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private svc = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('trendChart') trendChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('statusChart') statusChartRef!: ElementRef<HTMLCanvasElement>;

  stats: DashboardStats | null = null;
  loading = true;
  today = new Date();

  private trendChart?: Chart;
  private statusChart?: Chart;

  ngOnInit(): void {
    this.svc.getStats().subscribe(data => {
      this.stats = data;
      this.loading = false;
      this.cdr.detectChanges();
      this.buildCharts();
    });
  }

  private buildCharts(): void {
    if (!this.stats || !this.trendChartRef?.nativeElement || !this.statusChartRef?.nativeElement) return;

    if (this.trendChart) this.trendChart.destroy();
    this.trendChart = new Chart(this.trendChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.stats.bookingTrend.map(t => {
          const d = new Date(t.date);
          return `${d.getDate()}/${d.getMonth() + 1}`;
        }),
        datasets: [
          {
            label: 'Reservas',
            data: this.stats.bookingTrend.map(t => t.count),
            backgroundColor: 'rgba(57, 73, 171, 0.7)',
            borderRadius: 4
          },
          {
            label: 'Ingresos (€)',
            data: this.stats.bookingTrend.map(t => t.revenue),
            backgroundColor: 'rgba(233, 30, 99, 0.5)',
            borderRadius: 4,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Reservas' } },
          y1: { beginAtZero: true, position: 'right', title: { display: true, text: 'Ingresos (€)' }, grid: { drawOnChartArea: false } }
        }
      }
    });

    if (this.statusChart) this.statusChart.destroy();
    const statusColors: Record<string, string> = {
      Pending: '#ff9800', Confirmed: '#4caf50', CheckedIn: '#2196f3',
      CheckedOut: '#9c27b0', Cancelled: '#f44336'
    };
    this.statusChart = new Chart(this.statusChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.stats.bookingsByStatus.map(s => s.status),
        datasets: [{
          data: this.stats.bookingsByStatus.map(s => s.count),
          backgroundColor: this.stats.bookingsByStatus.map(s => statusColors[s.status] ?? '#999'),
          borderWidth: 2
        }]
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } }, cutout: '60%' }
    });
  }

  get revenueGrowth(): number {
    if (!this.stats || this.stats.revenueLastMonth === 0) return 0;
    return Math.round(((this.stats.revenueThisMonth - this.stats.revenueLastMonth) / this.stats.revenueLastMonth) * 100);
  }

  getOccupancyClass(rate: number): string {
    if (rate >= 75) return 'high';
    if (rate >= 40) return 'medium';
    return 'low';
  }
}
