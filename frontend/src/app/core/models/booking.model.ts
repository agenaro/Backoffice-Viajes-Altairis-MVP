export type BookingStatus = 'Pending' | 'Confirmed' | 'CheckedIn' | 'CheckedOut' | 'Cancelled';

export interface Booking {
  id: number;
  hotelId: number;
  hotelName: string;
  hotelCity: string;
  roomTypeId: number;
  roomTypeName: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  rooms: number;
  totalPrice: number;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
}

export interface CreateBooking {
  hotelId: number;
  roomTypeId: number;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  totalPrice: number;
  notes?: string;
}

export interface BookingQueryParams {
  hotelId?: number;
  status?: string;
  search?: string;
  checkInFrom?: string;
  checkInTo?: string;
  page?: number;
  pageSize?: number;
}
