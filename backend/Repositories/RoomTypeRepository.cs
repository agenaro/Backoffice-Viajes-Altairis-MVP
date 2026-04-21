using Altairis.API.Data;
using Altairis.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Altairis.API.Repositories;

public class RoomTypeRepository(AppDbContext db) : IRoomTypeRepository
{
    public async Task<IEnumerable<RoomType>> GetByHotelIdAsync(int hotelId) =>
        await db.RoomTypes.Where(r => r.HotelId == hotelId).ToListAsync();

    public async Task<RoomType?> GetByIdAsync(int id) =>
        await db.RoomTypes.Include(r => r.Hotel).FirstOrDefaultAsync(r => r.Id == id);

    public async Task<RoomType> CreateAsync(RoomType roomType)
    {
        db.RoomTypes.Add(roomType);
        await db.SaveChangesAsync();
        return roomType;
    }

    public async Task<RoomType?> UpdateAsync(int id, RoomType updated)
    {
        var rt = await db.RoomTypes.FindAsync(id);
        if (rt is null) return null;

        rt.Name = updated.Name;
        rt.Description = updated.Description;
        rt.MaxOccupancy = updated.MaxOccupancy;
        rt.BasePrice = updated.BasePrice;
        rt.TotalRooms = updated.TotalRooms;

        await db.SaveChangesAsync();
        return rt;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var rt = await db.RoomTypes.FindAsync(id);
        if (rt is null) return false;
        db.RoomTypes.Remove(rt);
        await db.SaveChangesAsync();
        return true;
    }
}
