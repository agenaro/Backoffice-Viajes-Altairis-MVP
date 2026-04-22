import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AvailabilityService } from '../../core/services/availability.service';
import { HotelService } from '../../core/services/hotel.service';
import { RoomTypeService } from '../../core/services/room-type.service';
import { Availability } from '../../core/models/availability.model';
import { Hotel } from '../../core/models/hotel.model';
import { RoomType } from '../../core/models/room-type.model';
import { BulkAvailabilityDialogComponent } from './bulk-dialog.component';

@Component({
  selector: 'app-availability',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule,
    MatTableModule, MatProgressBarModule, MatDialogModule,
    MatSnackBarModule, MatTooltipModule, MatDatepickerModule
  ],
  templateUrl: './availability.component.html',
  styleUrl: './availability.component.scss'
})
export class AvailabilityComponent implements OnInit {
  private svc = inject(AvailabilityService);
  private hotelSvc = inject(HotelService);
  private rtSvc = inject(RoomTypeService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  hotels: Hotel[] = [];
  roomTypes: RoomType[] = [];
  availabilities: Availability[] = [];
  loading = false;

  selectedHotelId: number | null = null;
  selectedRoomTypeId: number | null = null;
  startDate: Date | null = null;
  endDate: Date | null = null;

  displayedColumns = ['date', 'hotelName', 'roomType', 'availableRooms', 'occupancy', 'price', 'actions'];

  ngOnInit(): void {
    const today = new Date();
    this.startDate = today;
    this.endDate = new Date(today.getTime() + 14 * 86400000);

    this.hotelSvc.getAll({ pageSize: 100, isActive: true }).subscribe(r => this.hotels = r.items);
    this.load();
  }

  onHotelChange(): void {
    this.selectedRoomTypeId = null;
    this.roomTypes = [];
    if (this.selectedHotelId) {
      this.rtSvc.getByHotel(this.selectedHotelId).subscribe(rts => this.roomTypes = rts);
    }
    this.load();
  }

  private formatDate(d: Date | null): string | undefined {
    if (!d) return undefined;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  load(): void {
    this.loading = true;
    this.svc.get({
      hotelId: this.selectedHotelId ?? undefined,
      roomTypeId: this.selectedRoomTypeId ?? undefined,
      startDate: this.formatDate(this.startDate),
      endDate: this.formatDate(this.endDate)
    }).subscribe(data => {
      this.availabilities = data;
      this.loading = false;
    });
  }

  openBulkDialog(): void {
    const ref = this.dialog.open(BulkAvailabilityDialogComponent, {
      width: '500px',
      data: { hotels: this.hotels }
    });
    ref.afterClosed().subscribe(saved => { if (saved) { this.snack.open('Disponibilidad actualizada', 'OK', { duration: 3000 }); this.load(); } });
  }

  get avgOccupancy(): number {
    if (!this.availabilities.length) return 0;
    return this.availabilities.reduce((s, a) => s + a.occupancyRate, 0) / this.availabilities.length;
  }

  getOccupancyClass(rate: number): string {
    if (rate >= 75) return 'high';
    if (rate >= 40) return 'medium';
    return 'low';
  }
}
