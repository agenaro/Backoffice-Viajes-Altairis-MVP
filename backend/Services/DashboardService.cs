using Altairis.API.Data;
using Altairis.API.DTOs.Dashboard;
using Altairis.API.Models;
using Altairis.API.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Altairis.API.Services;

public class DashboardService(AppDbContext db, IBookingRepository bookingRepo) : IDashboardService
{
    public async Task<DashboardStatsDto> GetStatsAsync()
    {
        var today = DateTime.UtcNow.Date;
        var firstDayThisMonth = new DateTime(today.Year, today.Month, 1);
        var firstDayLastMonth = firstDayThisMonth.AddMonths(-1);

        var totalHotels = await db.Hotels.CountAsync();
        var activeHotels = await db.Hotels.CountAsync(h => h.IsActive);
        var totalRoomTypes = await db.RoomTypes.CountAsync();
        var totalBookings = await db.Bookings.CountAsync();
        var bookingsToday = await db.Bookings.CountAsync(b => b.CreatedAt.Date == today);
        var checkInsToday = await db.Bookings.CountAsync(b => b.CheckIn == today && b.Status != BookingStatus.Cancelled);
        var checkOutsToday = await db.Bookings.CountAsync(b => b.CheckOut == today && b.Status != BookingStatus.Cancelled);
        var activeBookings = await db.Bookings.CountAsync(b => b.Status == BookingStatus.Confirmed || b.Status == BookingStatus.CheckedIn);

        var revenueThisMonth = await db.Bookings
            .Where(b => b.CreatedAt >= firstDayThisMonth && b.Status != BookingStatus.Cancelled)
            .SumAsync(b => (decimal?)b.TotalPrice) ?? 0;

        var revenueLastMonth = await db.Bookings
            .Where(b => b.CreatedAt >= firstDayLastMonth && b.CreatedAt < firstDayThisMonth && b.Status != BookingStatus.Cancelled)
            .SumAsync(b => (decimal?)b.TotalPrice) ?? 0;

        var availabilityData = await db.Availabilities
            .Include(a => a.RoomType)
            .Where(a => a.Date == today)
            .ToListAsync();

        var occupancyRate = availabilityData.Any()
            ? availabilityData.Average(a => a.RoomType.TotalRooms > 0
                ? (double)(a.RoomType.TotalRooms - a.AvailableRooms) / a.RoomType.TotalRooms * 100
                : 0)
            : 0;

        var trendData = await bookingRepo.GetTrendAsync(14);
        var allDates = Enumerable.Range(0, 14).Select(i => today.AddDays(-13 + i)).ToList();
        var trendDict = trendData.ToDictionary(t => t.Item1, t => t);

        var trend = allDates.Select(d => new BookingTrendDto
        {
            Date = d.ToString("yyyy-MM-dd"),
            Count = trendDict.TryGetValue(d, out var t) ? t.Item2 : 0,
            Revenue = trendDict.TryGetValue(d, out var r) ? r.Item3 : 0
        }).ToList();

        var byStatus = await bookingRepo.GetBookingsByStatusAsync();

        var hotelOccupancy = await db.Hotels.Where(h => h.IsActive)
            .Select(h => new HotelOccupancyDto
            {
                HotelName = h.Name,
                OccupancyRate = h.RoomTypes
                    .SelectMany(rt => rt.Availabilities.Where(a => a.Date == today))
                    .Any()
                    ? h.RoomTypes.SelectMany(rt => rt.Availabilities.Where(a => a.Date == today))
                        .Average(a => a.RoomType.TotalRooms > 0
                            ? (double)(a.RoomType.TotalRooms - a.AvailableRooms) / a.RoomType.TotalRooms * 100
                            : 0)
                    : 0
            }).ToListAsync();

        return new DashboardStatsDto
        {
            TotalHotels = totalHotels,
            ActiveHotels = activeHotels,
            TotalRoomTypes = totalRoomTypes,
            TotalBookings = totalBookings,
            BookingsToday = bookingsToday,
            CheckInsToday = checkInsToday,
            CheckOutsToday = checkOutsToday,
            ActiveBookings = activeBookings,
            RevenueThisMonth = revenueThisMonth,
            RevenueLastMonth = revenueLastMonth,
            AverageOccupancyRate = Math.Round(occupancyRate, 1),
            BookingTrend = trend,
            HotelOccupancy = hotelOccupancy,
            BookingsByStatus = byStatus.Select(kvp => new BookingsByStatusDto { Status = kvp.Key, Count = kvp.Value })
        };
    }
}
