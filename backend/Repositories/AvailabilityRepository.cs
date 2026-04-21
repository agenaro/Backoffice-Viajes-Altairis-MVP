using Altairis.API.Data;
using Altairis.API.DTOs.Availability;
using Altairis.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Altairis.API.Repositories;

public class AvailabilityRepository(AppDbContext db) : IAvailabilityRepository
{
    public async Task<IEnumerable<Availability>> GetAsync(AvailabilityQueryParams q)
    {
        var query = db.Availabilities
            .Include(a => a.RoomType).ThenInclude(r => r.Hotel)
            .AsQueryable();

        if (q.RoomTypeId.HasValue)
            query = query.Where(a => a.RoomTypeId == q.RoomTypeId.Value);

        if (q.HotelId.HasValue)
            query = query.Where(a => a.RoomType.HotelId == q.HotelId.Value);

        if (q.StartDate.HasValue)
            query = query.Where(a => a.Date >= q.StartDate.Value);

        if (q.EndDate.HasValue)
            query = query.Where(a => a.Date <= q.EndDate.Value);

        return await query.OrderBy(a => a.Date).ThenBy(a => a.RoomTypeId).ToListAsync();
    }

    public async Task<Availability?> GetByIdAsync(int id) =>
        await db.Availabilities.Include(a => a.RoomType).FirstOrDefaultAsync(a => a.Id == id);

    public async Task<Availability?> GetByRoomTypeAndDateAsync(int roomTypeId, DateTime date) =>
        await db.Availabilities.FirstOrDefaultAsync(a => a.RoomTypeId == roomTypeId && a.Date == date.Date);

    public async Task<Availability> CreateAsync(Availability availability)
    {
        db.Availabilities.Add(availability);
        await db.SaveChangesAsync();
        return availability;
    }

    public async Task<Availability?> UpdateAsync(int id, Availability updated)
    {
        var av = await db.Availabilities.FindAsync(id);
        if (av is null) return null;
        av.AvailableRooms = updated.AvailableRooms;
        av.Price = updated.Price;
        await db.SaveChangesAsync();
        return av;
    }

    public async Task BulkUpsertAsync(IEnumerable<Availability> availabilities)
    {
        foreach (var av in availabilities)
        {
            var existing = await db.Availabilities
                .FirstOrDefaultAsync(a => a.RoomTypeId == av.RoomTypeId && a.Date == av.Date);

            if (existing is null)
                db.Availabilities.Add(av);
            else
            {
                existing.AvailableRooms = av.AvailableRooms;
                existing.Price = av.Price;
            }
        }
        await db.SaveChangesAsync();
    }
}
