export interface Availability {
  id: number;
  roomTypeId: number;
  roomTypeName: string;
  hotelId: number;
  hotelName: string;
  date: string;
  availableRooms: number;
  totalRooms: number;
  price: number;
  occupancyRate: number;
}

export interface CreateAvailability {
  roomTypeId: number;
  date: string;
  availableRooms: number;
  price: number;
}

export interface UpdateAvailability {
  availableRooms: number;
  price: number;
}

export interface BulkAvailability {
  roomTypeId: number;
  startDate: string;
  endDate: string;
  availableRooms: number;
  price: number;
}

export interface AvailabilityQueryParams {
  hotelId?: number;
  roomTypeId?: number;
  startDate?: string;
  endDate?: string;
}
