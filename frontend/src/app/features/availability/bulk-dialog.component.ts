import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { RoomTypeService } from '../../core/services/room-type.service';
import { AvailabilityService } from '../../core/services/availability.service';
import { Hotel } from '../../core/models/hotel.model';
import { RoomType } from '../../core/models/room-type.model';

@Component({
  selector: 'app-bulk-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule, ReactiveFormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule,
    MatDatepickerModule
  ],
  template: `
    <h2 mat-dialog-title><mat-icon>edit_calendar</mat-icon> Carga Masiva de Disponibilidad</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form-grid">
        <mat-form-field appearance="outline" style="grid-column:1/-1">
          <mat-label>Hotel</mat-label>
          <mat-select formControlName="hotelId" (selectionChange)="onHotelChange()">
            @for (h of data.hotels; track h.id) {
              <mat-option [value]="h.id">{{ h.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" style="grid-column:1/-1">
          <mat-label>Tipo de Habitación</mat-label>
          <mat-select formControlName="roomTypeId" (selectionChange)="onRoomTypeChange()">
            @for (rt of roomTypes; track rt.id) {
              <mat-option [value]="rt.id">{{ rt.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" style="grid-column:1/-1">
          <mat-label>Rango de fechas</mat-label>
          <mat-date-range-input [rangePicker]="picker">
            <input matStartDate formControlName="startDate" placeholder="Fecha inicio" />
            <input matEndDate formControlName="endDate" placeholder="Fecha fin" />
          </mat-date-range-input>
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-date-range-picker #picker></mat-date-range-picker>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Habitaciones disponibles</mat-label>
          <input matInput type="number" formControlName="availableRooms" min="0" [max]="selectedRoomType?.totalRooms ?? null" />
          @if (selectedRoomType) {
            <mat-hint>Máximo: {{ selectedRoomType.totalRooms }} habitaciones</mat-hint>
          }
          @if (form.get('availableRooms')?.hasError('max')) {
            <mat-error>No puede superar {{ selectedRoomType?.totalRooms }} habitaciones</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Precio (€/noche)</mat-label>
          <mat-icon matPrefix>euro</mat-icon>
          <input matInput type="number" formControlName="price" min="0" step="0.01" />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="form.invalid || saving">
        {{ saving ? 'Guardando...' : 'Aplicar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`.form-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; padding-top:8px; min-width:420px; } h2 { display:flex; align-items:center; gap:8px; }`]
})
export class BulkAvailabilityDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private rtSvc = inject(RoomTypeService);
  private avSvc = inject(AvailabilityService);
  private ref = inject(MatDialogRef<BulkAvailabilityDialogComponent>);
  data = inject<{ hotels: Hotel[] }>(MAT_DIALOG_DATA);

  roomTypes: RoomType[] = [];
  selectedRoomType: RoomType | null = null;
  saving = false;

  form = this.fb.group({
    hotelId: [null as number | null, Validators.required],
    roomTypeId: [null as number | null, Validators.required],
    startDate: [new Date() as Date | null, Validators.required],
    endDate: [new Date(Date.now() + 30 * 86400000) as Date | null, Validators.required],
    availableRooms: [0, [Validators.required, Validators.min(0)]],
    price: [100, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(): void {}

  onHotelChange(): void {
    const hotelId = this.form.value.hotelId;
    this.selectedRoomType = null;
    this.roomTypes = [];
    this.form.patchValue({ roomTypeId: null });
    if (hotelId) this.rtSvc.getByHotel(hotelId).subscribe(rts => this.roomTypes = rts);
  }

  onRoomTypeChange(): void {
    const rtId = this.form.value.roomTypeId;
    this.selectedRoomType = this.roomTypes.find(rt => rt.id === rtId) ?? null;
    const ctrl = this.form.get('availableRooms')!;
    if (this.selectedRoomType) {
      ctrl.setValidators([Validators.required, Validators.min(0), Validators.max(this.selectedRoomType.totalRooms)]);
    } else {
      ctrl.setValidators([Validators.required, Validators.min(0)]);
    }
    ctrl.updateValueAndValidity();
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const val = this.form.value;
    const formatDate = (d: Date | null | undefined): string => {
      if (!d) return '';
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };
    this.avSvc.bulkUpsert({
      roomTypeId: val.roomTypeId!,
      startDate: formatDate(val.startDate as Date),
      endDate: formatDate(val.endDate as Date),
      availableRooms: val.availableRooms!,
      price: val.price!
    }).subscribe({
      next: () => this.ref.close(true),
      error: () => this.saving = false
    });
  }
}
