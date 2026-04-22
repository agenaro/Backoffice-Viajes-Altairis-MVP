import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { BookingService } from '../../../core/services/booking.service';
import { HotelService } from '../../../core/services/hotel.service';
import { Booking, BookingStatus } from '../../../core/models/booking.model';
import { Hotel } from '../../../core/models/hotel.model';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    MatCardModule, MatTableModule, MatPaginatorModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatProgressBarModule,
    MatSnackBarModule, MatTooltipModule, MatMenuModule
  ],
  templateUrl: './booking-list.component.html',
  styleUrl: './booking-list.component.scss'
})
export class BookingListComponent implements OnInit {
  private svc = inject(BookingService);
  private hotelSvc = inject(HotelService);
  private snack = inject(MatSnackBar);

  bookings: Booking[] = [];
  hotels: Hotel[] = [];
  totalCount = 0;
  loading = false;

  search = '';
  statusFilter = '';
  hotelFilter: number | null = null;

  page = 1;
  pageSize = 20;

  statuses: BookingStatus[] = ['Pending', 'Confirmed', 'CheckedIn', 'CheckedOut', 'Cancelled'];
  displayedColumns = ['guest', 'hotel', 'roomType', 'dates', 'price', 'status', 'actions'];

  ngOnInit(): void {
    this.hotelSvc.getAll({ pageSize: 100 }).subscribe(r => this.hotels = r.items);
    this.load();
  }

  load(): void {
    this.loading = true;
    this.svc.getAll({
      search: this.search || undefined,
      status: this.statusFilter || undefined,
      hotelId: this.hotelFilter ?? undefined,
      page: this.page,
      pageSize: this.pageSize
    }).subscribe(r => {
      this.bookings = r.items;
      this.totalCount = r.totalCount;
      this.loading = false;
    });
  }

  onSearch(): void { this.page = 1; this.load(); }

  onPageChange(e: PageEvent): void {
    this.page = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.load();
  }

  updateStatus(booking: Booking, status: BookingStatus): void {
    this.svc.updateStatus(booking.id, status).subscribe(() => {
      this.snack.open('Estado actualizado', 'OK', { duration: 2000 });
      this.load();
    });
  }

  statusLabel: Record<string, string> = {
    Pending: 'Pendiente', Confirmed: 'Confirmada',
    CheckedIn: 'Check-in', CheckedOut: 'Check-out', Cancelled: 'Cancelar'
  };

  nextStatuses(current: string): BookingStatus[] {
    const transitions: Record<string, BookingStatus[]> = {
      Pending: ['Confirmed', 'Cancelled'],
      Confirmed: ['CheckedIn', 'Cancelled'],
      CheckedIn: ['CheckedOut'],
      CheckedOut: [],
      Cancelled: []
    };
    return transitions[current] ?? [];
  }
}
