import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RoomTypeService } from '../../../core/services/room-type.service';
import { HotelService } from '../../../core/services/hotel.service';
import { RoomType } from '../../../core/models/room-type.model';
import { Hotel } from '../../../core/models/hotel.model';
import { RoomTypeFormComponent } from '../room-type-form/room-type-form.component';

@Component({
  selector: 'app-room-type-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatTableModule, MatButtonModule,
    MatIconModule, MatDialogModule, MatSnackBarModule,
    MatTooltipModule, MatProgressBarModule
  ],
  templateUrl: './room-type-list.component.html',
  styleUrl: './room-type-list.component.scss'
})
export class RoomTypeListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private rtSvc = inject(RoomTypeService);
  private hotelSvc = inject(HotelService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  hotel: Hotel | null = null;
  roomTypes: RoomType[] = [];
  loading = false;

  displayedColumns = ['name', 'maxOccupancy', 'basePrice', 'totalRooms', 'actions'];

  ngOnInit(): void {
    const hotelId = +this.route.snapshot.paramMap.get('hotelId')!;
    this.hotelSvc.getById(hotelId).subscribe(h => this.hotel = h);
    this.load(hotelId);
  }

  load(hotelId?: number): void {
    const id = hotelId ?? this.hotel!.id;
    this.loading = true;
    this.rtSvc.getByHotel(id).subscribe(rts => {
      this.roomTypes = rts;
      this.loading = false;
    });
  }

  openForm(roomType?: RoomType): void {
    const ref = this.dialog.open(RoomTypeFormComponent, {
      width: '520px',
      data: { hotelId: this.hotel!.id, roomType }
    });
    ref.afterClosed().subscribe(saved => { if (saved) this.load(); });
  }

  delete(rt: RoomType): void {
    if (!confirm(`¿Eliminar "${rt.name}"?`)) return;
    this.rtSvc.delete(rt.id).subscribe(() => {
      this.snack.open('Tipo de habitación eliminado', 'OK', { duration: 3000 });
      this.load();
    });
  }
}
