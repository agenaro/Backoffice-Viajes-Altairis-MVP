import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RoomTypeService } from '../../../core/services/room-type.service';
import { RoomType } from '../../../core/models/room-type.model';

@Component({
  selector: 'app-room-type-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.roomType ? 'Editar' : 'Nuevo' }} Tipo de Habitación</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form-grid">
        <mat-form-field appearance="outline" style="grid-column:1/-1">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="name" placeholder="Ej: Suite Junior" />
        </mat-form-field>
        <mat-form-field appearance="outline" style="grid-column:1/-1">
          <mat-label>Descripción</mat-label>
          <textarea matInput formControlName="description" rows="2"></textarea>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Ocupación máxima</mat-label>
          <input matInput type="number" formControlName="maxOccupancy" min="1" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Precio base (€/noche)</mat-label>
          <mat-icon matPrefix>euro</mat-icon>
          <input matInput type="number" formControlName="basePrice" min="0" step="0.01" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Total habitaciones</mat-label>
          <input matInput type="number" formControlName="totalRooms" min="1" />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="form.invalid || saving">
        {{ saving ? 'Guardando...' : 'Guardar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`.form-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; padding-top:8px; min-width:400px; }`]
})
export class RoomTypeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private svc = inject(RoomTypeService);
  private ref = inject(MatDialogRef<RoomTypeFormComponent>);
  data = inject<{ hotelId: number; roomType?: RoomType }>(MAT_DIALOG_DATA);

  saving = false;

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    maxOccupancy: [2, [Validators.required, Validators.min(1)]],
    basePrice: [100, [Validators.required, Validators.min(0)]],
    totalRooms: [10, [Validators.required, Validators.min(1)]]
  });

  ngOnInit(): void {
    if (this.data.roomType) this.form.patchValue(this.data.roomType);
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const val = this.form.value as any;
    const obs = this.data.roomType
      ? this.svc.update(this.data.roomType.id, val)
      : this.svc.create({ ...val, hotelId: this.data.hotelId });
    obs.subscribe({ next: () => this.ref.close(true), error: () => this.saving = false });
  }
}
