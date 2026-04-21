namespace Altairis.API.DTOs.RoomType;

public class RoomTypeDto
{
    public int Id { get; set; }
    public int HotelId { get; set; }
    public string HotelName { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int MaxOccupancy { get; set; }
    public decimal BasePrice { get; set; }
    public int TotalRooms { get; set; }
}

public class CreateRoomTypeDto
{
    public int HotelId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int MaxOccupancy { get; set; }
    public decimal BasePrice { get; set; }
    public int TotalRooms { get; set; }
}

public class UpdateRoomTypeDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int MaxOccupancy { get; set; }
    public decimal BasePrice { get; set; }
    public int TotalRooms { get; set; }
}
