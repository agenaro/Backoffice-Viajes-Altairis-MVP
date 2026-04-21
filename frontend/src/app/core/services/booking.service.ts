import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Booking, CreateBooking, BookingQueryParams, BookingStatus } from '../models/booking.model';
import { PagedResult } from '../models/paged-result.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/bookings`;

  getAll(params: BookingQueryParams = {}): Observable<PagedResult<Booking>> {
    let p = new HttpParams();
    if (params.hotelId) p = p.set('hotelId', params.hotelId);
    if (params.status) p = p.set('status', params.status);
    if (params.search) p = p.set('search', params.search);
    if (params.checkInFrom) p = p.set('checkInFrom', params.checkInFrom);
    if (params.checkInTo) p = p.set('checkInTo', params.checkInTo);
    if (params.page) p = p.set('page', params.page);
    if (params.pageSize) p = p.set('pageSize', params.pageSize);
    return this.http.get<PagedResult<Booking>>(this.base, { params: p });
  }

  getById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.base}/${id}`);
  }

  create(dto: CreateBooking): Observable<Booking> {
    return this.http.post<Booking>(this.base, dto);
  }

  updateStatus(id: number, status: BookingStatus): Observable<Booking> {
    return this.http.patch<Booking>(`${this.base}/${id}/status`, { status });
  }
}
