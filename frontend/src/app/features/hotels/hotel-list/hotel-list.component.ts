import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HotelService } from '../../../core/services/hotel.service';
import { Hotel } from '../../../core/models/hotel.model';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatInputModule, MatFormFieldModule, MatButtonModule,
    MatIconModule, MatCardModule, MatSelectModule,
    MatProgressBarModule, MatSnackBarModule, MatTooltipModule
  ],
  templateUrl: './hotel-list.component.html',
  styleUrl: './hotel-list.component.scss'
})
export class HotelListComponent implements OnInit {
  private svc = inject(HotelService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  hotels: Hotel[] = [];
  totalCount = 0;
  loading = false;

  search = '';
  countryFilter = '';
  starsFilter: number | null = null;

  page = 1;
  pageSize = 20;
  sortBy = 'name';
  sortDir = 'asc';

  displayedColumns = ['name', 'stars', 'city', 'country', 'roomTypes', 'status', 'actions'];

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.svc.getAll({
      search: this.search || undefined,
      country: this.countryFilter || undefined,
      stars: this.starsFilter ?? undefined,
      page: this.page,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
      sortDir: this.sortDir
    }).subscribe(result => {
      this.hotels = result.items;
      this.totalCount = result.totalCount;
      this.loading = false;
    });
  }

  onSearch(): void { this.page = 1; this.load(); }

  onPageChange(e: PageEvent): void {
    this.page = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.load();
  }

  onSort(sort: Sort): void {
    this.sortBy = sort.active || 'name';
    this.sortDir = sort.direction || 'asc';
    this.load();
  }

  edit(id: number): void { this.router.navigate(['/hotels', id, 'edit']); }

  viewRooms(id: number): void { this.router.navigate(['/hotels', id, 'room-types']); }

  delete(hotel: Hotel): void {
    if (!confirm(`¿Eliminar el hotel "${hotel.name}"?`)) return;
    this.svc.delete(hotel.id).subscribe(() => {
      this.snack.open('Hotel eliminado', 'OK', { duration: 3000 });
      this.load();
    });
  }

  starsArray(n: number): number[] { return Array(n).fill(0); }
}
