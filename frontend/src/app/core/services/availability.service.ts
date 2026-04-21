import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Availability, CreateAvailability, UpdateAvailability, BulkAvailability, AvailabilityQueryParams } from '../models/availability.model';

@Injectable({ providedIn: 'root' })
export class AvailabilityService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/availability`;

  get(params: AvailabilityQueryParams = {}): Observable<Availability[]> {
    let p = new HttpParams();
    if (params.hotelId) p = p.set('hotelId', params.hotelId);
    if (params.roomTypeId) p = p.set('roomTypeId', params.roomTypeId);
    if (params.startDate) p = p.set('startDate', params.startDate);
    if (params.endDate) p = p.set('endDate', params.endDate);
    return this.http.get<Availability[]>(this.base, { params: p });
  }

  create(dto: CreateAvailability): Observable<Availability> {
    return this.http.post<Availability>(this.base, dto);
  }

  update(id: number, dto: UpdateAvailability): Observable<Availability> {
    return this.http.put<Availability>(`${this.base}/${id}`, dto);
  }

  bulkUpsert(dto: BulkAvailability): Observable<void> {
    return this.http.post<void>(`${this.base}/bulk`, dto);
  }
}
