import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'hotels',
        loadComponent: () => import('./features/hotels/hotel-list/hotel-list.component').then(m => m.HotelListComponent)
      },
      {
        path: 'hotels/new',
        loadComponent: () => import('./features/hotels/hotel-form/hotel-form.component').then(m => m.HotelFormComponent)
      },
      {
        path: 'hotels/:id/edit',
        loadComponent: () => import('./features/hotels/hotel-form/hotel-form.component').then(m => m.HotelFormComponent)
      },
      {
        path: 'hotels/:hotelId/room-types',
        loadComponent: () => import('./features/room-types/room-type-list/room-type-list.component').then(m => m.RoomTypeListComponent)
      },
      {
        path: 'availability',
        loadComponent: () => import('./features/availability/availability.component').then(m => m.AvailabilityComponent)
      },
      {
        path: 'bookings',
        loadComponent: () => import('./features/bookings/booking-list/booking-list.component').then(m => m.BookingListComponent)
      },
      {
        path: 'bookings/new',
        loadComponent: () => import('./features/bookings/booking-form/booking-form.component').then(m => m.BookingFormComponent)
      }
    ]
  }
];
