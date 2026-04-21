import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BookingService } from '../../../core/services/booking.service';
import { HotelService } from '../../../core/services/hotel.service';
import { RoomTypeService } from '../../../core/services/room-type.service';
import { Hotel } from '../../../core/models/hotel.model';
import { RoomType } from '../../../core/models/room-type.model';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule,
    MatDatepickerModule, MatNativeDateModule, MatSnackBarModule
  ],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.scss'
})
export class BookingFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private svc = inject(BookingService);
  private hotelSvc = inject(HotelService);
  private rtSvc = inject(RoomTypeService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  hotels: Hotel[] = [];
  roomTypes: RoomType[] = [];
  saving = false;
  readonly today = new Date();

  form = this.fb.group({
    hotelId:     [null as number | null, Validators.required],
    roomTypeId:  [null as number | null, Validators.required],
    guestName:   ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
    guestEmail:  ['', [Validators.required, Validators.email]],
    guestPhone:  ['', Validators.pattern(/^[+\d\s\-()\\.]{7,20}$/)],
    checkIn:     [null as Date | null, Validators.required],
    checkOut:    [null as Date | null, Validators.required],
    rooms:       [1, [Validators.required, Validators.min(1), Validators.max(20)]],
    notes:       ['']
  });

  ngOnInit(): void {
    this.hotelSvc.getAll({ pageSize: 100, isActive: true }).subscribe(r => this.hotels = r.items);

    this.form.get('hotelId')!.valueChanges.subscribe(id => {
      if (id) this.rtSvc.getByHotel(id).subscribe(rts => this.roomTypes = rts);
      else this.roomTypes = [];
      this.form.patchValue({ roomTypeId: null });
    });

    this.form.get('checkIn')!.valueChanges.subscribe(() => {
      const checkOut = this.form.get('checkOut');
      if (checkOut?.value) checkOut.updateValueAndValidity();
    });
  }

  get minCheckOut(): Date {
    const ci = this.form.value.checkIn as Date | null;
    if (!ci) return this.today;
    const next = new Date(ci);
    next.setDate(next.getDate() + 1);
    return next;
  }

  get totalPrice(): number {
    const rt = this.roomTypes.find(r => r.id === this.form.value.roomTypeId);
    const ci = this.form.value.checkIn as Date | null;
    const co = this.form.value.checkOut as Date | null;
    const rooms = this.form.value.rooms ?? 1;
    if (!rt || !ci || !co || co <= ci) return 0;
    const nights = Math.ceil((co.getTime() - ci.getTime()) / 86400000);
    return rt.basePrice * nights * rooms;
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const val = this.form.value as any;
    const payload = {
      ...val,
      checkIn:    (val.checkIn as Date).toISOString().split('T')[0],
      checkOut:   (val.checkOut as Date).toISOString().split('T')[0],
      totalPrice: this.totalPrice
    };
    this.svc.create(payload).subscribe({
      next: () => {
        this.snack.open('Reserva creada', 'OK', { duration: 3000 });
        this.router.navigate(['/bookings']);
      },
      error: () => {
        this.snack.open('Error al crear reserva', 'OK', { duration: 3000 });
        this.saving = false;
      }
    });
  }

  cancel(): void { this.router.navigate(['/bookings']); }
}
