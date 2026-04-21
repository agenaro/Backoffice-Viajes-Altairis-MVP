export interface DashboardStats {
  totalHotels: number;
  activeHotels: number;
  totalRoomTypes: number;
  totalBookings: number;
  bookingsToday: number;
  checkInsToday: number;
  checkOutsToday: number;
  activeBookings: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  averageOccupancyRate: number;
  bookingTrend: BookingTrend[];
  hotelOccupancy: HotelOccupancy[];
  bookingsByStatus: BookingsByStatus[];
}

export interface BookingTrend {
  date: string;
  count: number;
  revenue: number;
}

export interface HotelOccupancy {
  hotelName: string;
  occupancyRate: number;
}

export interface BookingsByStatus {
  status: string;
  count: number;
}
