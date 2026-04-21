namespace Altairis.API.Models;

public class Availability
{
    public int Id { get; set; }
    public int RoomTypeId { get; set; }
    public RoomType RoomType { get; set; } = null!;
    public DateTime Date { get; set; }
    public int AvailableRooms { get; set; }
    public decimal Price { get; set; }
}
