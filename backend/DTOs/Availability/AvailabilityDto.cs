namespace Altairis.API.DTOs.Availability;

public class AvailabilityDto
{
    public int Id { get; set; }
    public int RoomTypeId { get; set; }
    public string RoomTypeName { get; set; } = string.Empty;
    public int HotelId { get; set; }
    public string HotelName { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public int AvailableRooms { get; set; }
    public int TotalRooms { get; set; }
    public decimal Price { get; set; }
    public decimal OccupancyRate => TotalRooms > 0 ? Math.Round((decimal)(TotalRooms - AvailableRooms) / TotalRooms * 100, 1) : 0;
}

public class CreateAvailabilityDto
{
    public int RoomTypeId { get; set; }
    public DateTime Date { get; set; }
    public int AvailableRooms { get; set; }
    public decimal Price { get; set; }
}

public class UpdateAvailabilityDto
{
    public int AvailableRooms { get; set; }
    public decimal Price { get; set; }
}

public class BulkAvailabilityDto
{
    public int RoomTypeId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int AvailableRooms { get; set; }
    public decimal Price { get; set; }
}

public class AvailabilityQueryParams
{
    public int? HotelId { get; set; }
    public int? RoomTypeId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}
