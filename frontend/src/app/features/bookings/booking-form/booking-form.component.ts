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
import { AvailabilityService } from '../../../core/services/availability.service';
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
  private avSvc = inject(AvailabilityService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  hotels: Hotel[] = [];
  roomTypes: RoomType[] = [];
  selectedRoomType: RoomType | null = null;
  availabilityMap = new Map<string, number>();
  availabilityError: string | null = null;
  saving = false;
  readonly today = new Date();

  form = this.fb.group({
    hotelId:    [null as number | null, Validators.required],
    roomTypeId: [null as number | null, Validators.required],
    guestName:  ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
    guestEmail: ['', [Validators.required, Validators.email]],
    guestPhone: ['', Validators.pattern(/^[+\d\s\-()\\.]{7,20}$/)],
    checkIn:    [null as Date | null, Validators.required],
    checkOut:   [null as Date | null, Validators.required],
    rooms:      [1, [Validators.required, Validators.min(1), Validators.max(20)]],
    notes:      ['']
  });

  // Arrow function preserves 'this' when passed to [matDatepickerFilter]
  dateFilter = (date: Date | null): boolean => {
    if (!date || !this.selectedRoomType) return true;
    const avail = this.availabilityMap.get(this.dateKey(date));
    return avail === undefined || avail > 0;
  };

  ngOnInit(): void {
    this.hotelSvc.getAll({ pageSize: 100, isActive: true }).subscribe(r => this.hotels = r.items);

    this.form.get('hotelId')!.valueChanges.subscribe(id => {
      if (id) this.rtSvc.getByHotel(id).subscribe(rts => this.roomTypes = rts);
      else this.roomTypes = [];
      this.selectedRoomType = null;
      this.availabilityMap.clear();
      this.availabilityError = null;
      this.form.patchValue({ roomTypeId: null });
    });

    this.form.get('roomTypeId')!.valueChanges.subscribe((id: number | null) => {
      this.selectedRoomType = this.roomTypes.find(rt => rt.id === id) ?? null;
      this.availabilityMap.clear();
      this.availabilityError = null;
      this.updateRoomsValidator();
      if (id) this.loadAvailability(id);
    });

    this.form.get('checkIn')!.valueChanges.subscribe(() => {
      const checkOut = this.form.get('checkOut');
      if (checkOut?.value) checkOut.updateValueAndValidity();
      this.checkAvailability();
    });

    this.form.get('checkOut')!.valueChanges.subscribe(() => this.checkAvailability());
    this.form.get('rooms')!.valueChanges.subscribe(() => this.checkAvailability());
  }

  private loadAvailability(roomTypeId: number): void {
    const start = this.dateKey(new Date());
    const end = this.dateKey(new Date(Date.now() + 365 * 86400000));
    this.avSvc.get({ roomTypeId, startDate: start, endDate: end }).subscribe(avs => {
      this.availabilityMap.clear();
      for (const av of avs) {
        this.availabilityMap.set(av.date.slice(0, 10), av.availableRooms);
      }
      this.checkAvailability();
    });
  }

  private checkAvailability(): void {
    const ci = this.form.value.checkIn as Date | null;
    const co = this.form.value.checkOut as Date | null;
    if (!ci || !co || !this.selectedRoomType || co <= ci) {
      this.availabilityError = null;
      this.updateRoomsValidator();
      return;
    }
    const days = Math.ceil((co.getTime() - ci.getTime()) / 86400000);
    let minAvail: number | null = null;
    for (let i = 0; i < days; i++) {
      const date = new Date(ci.getTime() + i * 86400000);
      const avail = this.availabilityMap.get(this.dateKey(date));
      if (avail !== undefined && (minAvail === null || avail < minAvail)) minAvail = avail;
    }

    this.updateRoomsValidator(minAvail ?? undefined);

    const rooms = this.form.value.rooms ?? 1;
    if (minAvail !== null && minAvail === 0) {
      this.availabilityError = 'No hay disponibilidad en el rango de fechas seleccionado.';
    } else if (minAvail !== null && minAvail < rooms) {
      this.availabilityError = `Solo hay ${minAvail} habitación(es) disponible(s) en las fechas seleccionadas.`;
    } else {
      this.availabilityError = null;
    }
  }

  private updateRoomsValidator(minAvail?: number): void {
    const ctrl = this.form.get('rooms')!;
    const totalMax = this.selectedRoomType?.totalRooms ?? 20;
    const max = minAvail !== undefined ? Math.min(totalMax, minAvail) : totalMax;
    ctrl.setValidators([Validators.required, Validators.min(1), Validators.max(max)]);
    ctrl.updateValueAndValidity({ emitEvent: false });
  }

  private dateKey(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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
    if (this.form.invalid || this.availabilityError) return;
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
      error: (err) => {
        const msg = err.error?.message ?? 'Error al crear reserva';
        this.snack.open(msg, 'OK', { duration: 5000 });
        this.saving = false;
      }
    });
  }

  cancel(): void { this.router.navigate(['/bookings']); }
}
