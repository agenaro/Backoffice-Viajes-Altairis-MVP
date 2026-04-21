import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RoomType, CreateRoomType, UpdateRoomType } from '../models/room-type.model';

@Injectable({ providedIn: 'root' })
export class RoomTypeService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/roomtypes`;

  getByHotel(hotelId: number): Observable<RoomType[]> {
    return this.http.get<RoomType[]>(this.base, { params: new HttpParams().set('hotelId', hotelId) });
  }

  getById(id: number): Observable<RoomType> {
    return this.http.get<RoomType>(`${this.base}/${id}`);
  }

  create(dto: CreateRoomType): Observable<RoomType> {
    return this.http.post<RoomType>(this.base, dto);
  }

  update(id: number, dto: UpdateRoomType): Observable<RoomType> {
    return this.http.put<RoomType>(`${this.base}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
