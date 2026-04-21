import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RoomTypeService } from '../../core/services/room-type.service';
import { AvailabilityService } from '../../core/services/availability.service';
import { Hotel } from '../../core/models/hotel.model';
import { RoomType } from '../../core/models/room-type.model';

@Component({
  selector: 'app-bulk-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule
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
          <mat-select formControlName="roomTypeId">
            @for (rt of roomTypes; track rt.id) {
              <mat-option [value]="rt.id">{{ rt.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Fecha inicio</mat-label>
          <input matInput type="date" formControlName="startDate" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Fecha fin</mat-label>
          <input matInput type="date" formControlName="endDate" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Habitaciones disponibles</mat-label>
          <input matInput type="number" formControlName="availableRooms" min="0" />
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
  saving = false;

  form = this.fb.group({
    hotelId: [null as number | null, Validators.required],
    roomTypeId: [null as number | null, Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    availableRooms: [0, [Validators.required, Validators.min(0)]],
    price: [100, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(): void {
    const today = new Date().toISOString().slice(0, 10);
    const end = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
    this.form.patchValue({ startDate: today, endDate: end });
  }

  onHotelChange(): void {
    const hotelId = this.form.value.hotelId;
    if (hotelId) this.rtSvc.getByHotel(hotelId).subscribe(rts => this.roomTypes = rts);
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const val = this.form.value as any;
    this.avSvc.bulkUpsert(val).subscribe({
      next: () => this.ref.close(true),
      error: () => this.saving = false
    });
  }
}
