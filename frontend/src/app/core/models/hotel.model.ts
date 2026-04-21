export interface Hotel {
  id: number;
  name: string;
  stars: number;
  address: string;
  city: string;
  country: string;
  phone?: string;
  email?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  roomTypesCount: number;
}

export interface CreateHotel {
  name: string;
  stars: number;
  address: string;
  city: string;
  country: string;
  phone?: string;
  email?: string;
  description?: string;
}

export interface UpdateHotel extends CreateHotel {
  isActive: boolean;
}

export interface HotelQueryParams {
  search?: string;
  country?: string;
  stars?: number;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
}
