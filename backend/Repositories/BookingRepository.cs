using Altairis.API.Data;
using Altairis.API.DTOs.Booking;
using Altairis.API.DTOs.Common;
using Altairis.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Altairis.API.Repositories;

public class BookingRepository(AppDbContext db) : IBookingRepository
{
    public async Task<PagedResult<Booking>> GetAllAsync(BookingQueryParams q)
    {
        var query = db.Bookings
            .Include(b => b.Hotel)
            .Include(b => b.RoomType)
            .AsQueryable();

        if (q.HotelId.HasValue)
            query = query.Where(b => b.HotelId == q.HotelId.Value);

        if (!string.IsNullOrWhiteSpace(q.Status) && Enum.TryParse<BookingStatus>(q.Status, true, out var status))
            query = query.Where(b => b.Status == status);

        if (!string.IsNullOrWhiteSpace(q.Search))
            query = query.Where(b => b.GuestName.Contains(q.Search) || b.GuestEmail.Contains(q.Search));

        if (q.CheckInFrom.HasValue)
            query = query.Where(b => b.CheckIn >= q.CheckInFrom.Value);

        if (q.CheckInTo.HasValue)
            query = query.Where(b => b.CheckIn <= q.CheckInTo.Value);

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(b => b.CreatedAt).Skip((q.Page - 1) * q.PageSize).Take(q.PageSize).ToListAsync();

        return new PagedResult<Booking> { Items = items, TotalCount = total, Page = q.Page, PageSize = q.PageSize };
    }

    public async Task<Booking?> GetByIdAsync(int id) =>
        await db.Bookings.Include(b => b.Hotel).Include(b => b.RoomType).FirstOrDefaultAsync(b => b.Id == id);

    public async Task<Booking> CreateAsync(Booking booking)
    {
        db.Bookings.Add(booking);
        await db.SaveChangesAsync();
        return booking;
    }

    public async Task<Booking?> UpdateStatusAsync(int id, BookingStatus status)
    {
        var booking = await db.Bookings.FindAsync(id);
        if (booking is null) return null;
        booking.Status = status;
        await db.SaveChangesAsync();
        return booking;
    }

    public async Task<IEnumerable<Booking>> GetRecentAsync(int count) =>
        await db.Bookings.Include(b => b.Hotel).Include(b => b.RoomType)
            .OrderByDescending(b => b.CreatedAt).Take(count).ToListAsync();

    public async Task<Dictionary<string, int>> GetBookingsByStatusAsync() =>
        await db.Bookings.GroupBy(b => b.Status)
            .Select(g => new { Status = g.Key.ToString(), Count = g.Count() })
            .ToDictionaryAsync(x => x.Status, x => x.Count);

    public async Task<IEnumerable<(DateTime Date, int Count, decimal Revenue)>> GetTrendAsync(int days)
    {
        var from = DateTime.UtcNow.Date.AddDays(-days);
        var raw = await db.Bookings
            .Where(b => b.CreatedAt >= from)
            .GroupBy(b => b.CreatedAt.Date)
            .Select(g => new { Date = g.Key, Count = g.Count(), Revenue = g.Sum(b => b.TotalPrice) })
            .OrderBy(x => x.Date)
            .ToListAsync();
        return raw.Select(x => (x.Date, x.Count, x.Revenue));
    }
}
