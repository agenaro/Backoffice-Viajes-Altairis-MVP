namespace Altairis.API.DTOs.Dashboard;

public class DashboardStatsDto
{
    public int TotalHotels { get; set; }
    public int ActiveHotels { get; set; }
    public int TotalRoomTypes { get; set; }
    public int TotalBookings { get; set; }
    public int BookingsToday { get; set; }
    public int CheckInsToday { get; set; }
    public int CheckOutsToday { get; set; }
    public int ActiveBookings { get; set; }
    public decimal RevenueThisMonth { get; set; }
    public decimal RevenueLastMonth { get; set; }
    public double AverageOccupancyRate { get; set; }
    public IEnumerable<BookingTrendDto> BookingTrend { get; set; } = [];
    public IEnumerable<HotelOccupancyDto> HotelOccupancy { get; set; } = [];
    public IEnumerable<BookingsByStatusDto> BookingsByStatus { get; set; } = [];
}

public class BookingTrendDto
{
    public string Date { get; set; } = string.Empty;
    public int Count { get; set; }
    public decimal Revenue { get; set; }
}

public class HotelOccupancyDto
{
    public string HotelName { get; set; } = string.Empty;
    public double OccupancyRate { get; set; }
}

public class BookingsByStatusDto
{
    public string Status { get; set; } = string.Empty;
    public int Count { get; set; }
}
