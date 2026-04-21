import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Hotel, CreateHotel, UpdateHotel, HotelQueryParams } from '../models/hotel.model';
import { PagedResult } from '../models/paged-result.model';

@Injectable({ providedIn: 'root' })
export class HotelService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/hotels`;

  getAll(params: HotelQueryParams = {}): Observable<PagedResult<Hotel>> {
    let p = new HttpParams();
    if (params.search) p = p.set('search', params.search);
    if (params.country) p = p.set('country', params.country);
    if (params.stars != null) p = p.set('stars', params.stars);
    if (params.isActive != null) p = p.set('isActive', params.isActive);
    if (params.page) p = p.set('page', params.page);
    if (params.pageSize) p = p.set('pageSize', params.pageSize);
    if (params.sortBy) p = p.set('sortBy', params.sortBy);
    if (params.sortDir) p = p.set('sortDir', params.sortDir);
    return this.http.get<PagedResult<Hotel>>(this.base, { params: p });
  }

  getById(id: number): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.base}/${id}`);
  }

  create(dto: CreateHotel): Observable<Hotel> {
    return this.http.post<Hotel>(this.base, dto);
  }

  update(id: number, dto: UpdateHotel): Observable<Hotel> {
    return this.http.put<Hotel>(`${this.base}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
