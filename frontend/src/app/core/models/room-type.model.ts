export interface RoomType {
  id: number;
  hotelId: number;
  hotelName: string;
  name: string;
  description?: string;
  maxOccupancy: number;
  basePrice: number;
  totalRooms: number;
}

export interface CreateRoomType {
  hotelId: number;
  name: string;
  description?: string;
  maxOccupancy: number;
  basePrice: number;
  totalRooms: number;
}

export interface UpdateRoomType {
  name: string;
  description?: string;
  maxOccupancy: number;
  basePrice: number;
  totalRooms: number;
}
