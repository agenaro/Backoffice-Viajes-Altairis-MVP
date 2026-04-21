import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HotelService } from '../../../core/services/hotel.service';

@Component({
  selector: 'app-hotel-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatSelectModule,
    MatSlideToggleModule, MatSnackBarModule
  ],
  templateUrl: './hotel-form.component.html',
  styleUrl: './hotel-form.component.scss'
})
export class HotelFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private svc = inject(HotelService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snack = inject(MatSnackBar);

  isEdit = false;
  hotelId: number | null = null;
  saving = false;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    stars: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
    address: ['', Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
    phone: [''],
    email: ['', Validators.email],
    description: [''],
    isActive: [true]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.hotelId = +id;
      this.svc.getById(this.hotelId).subscribe(h => this.form.patchValue(h));
    }
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const value = this.form.value as any;

    const obs = this.isEdit
      ? this.svc.update(this.hotelId!, value)
      : this.svc.create(value);

    obs.subscribe({
      next: () => {
        this.snack.open(this.isEdit ? 'Hotel actualizado' : 'Hotel creado', 'OK', { duration: 3000 });
        this.router.navigate(['/hotels']);
      },
      error: () => {
        this.snack.open('Error al guardar', 'OK', { duration: 3000 });
        this.saving = false;
      }
    });
  }

  cancel(): void { this.router.navigate(['/hotels']); }
}
