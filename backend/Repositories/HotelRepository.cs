using Altairis.API.Data;
using Altairis.API.DTOs.Common;
using Altairis.API.DTOs.Hotel;
using Altairis.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Altairis.API.Repositories;

public class HotelRepository(AppDbContext db) : IHotelRepository
{
    public async Task<PagedResult<Hotel>> GetAllAsync(HotelQueryParams q)
    {
        var query = db.Hotels.Include(h => h.RoomTypes).AsQueryable();

        if (!string.IsNullOrWhiteSpace(q.Search))
            query = query.Where(h => h.Name.Contains(q.Search) || h.City.Contains(q.Search) || h.Country.Contains(q.Search));

        if (!string.IsNullOrWhiteSpace(q.Country))
            query = query.Where(h => h.Country == q.Country);

        if (q.Stars.HasValue)
            query = query.Where(h => h.Stars == q.Stars.Value);

        if (q.IsActive.HasValue)
            query = query.Where(h => h.IsActive == q.IsActive.Value);

        query = q.SortBy.ToLower() switch
        {
            "city" => q.SortDir == "desc" ? query.OrderByDescending(h => h.City) : query.OrderBy(h => h.City),
            "stars" => q.SortDir == "desc" ? query.OrderByDescending(h => h.Stars) : query.OrderBy(h => h.Stars),
            "createdat" => q.SortDir == "desc" ? query.OrderByDescending(h => h.CreatedAt) : query.OrderBy(h => h.CreatedAt),
            _ => q.SortDir == "desc" ? query.OrderByDescending(h => h.Name) : query.OrderBy(h => h.Name)
        };

        var total = await query.CountAsync();
        var items = await query.Skip((q.Page - 1) * q.PageSize).Take(q.PageSize).ToListAsync();

        return new PagedResult<Hotel> { Items = items, TotalCount = total, Page = q.Page, PageSize = q.PageSize };
    }

    public async Task<Hotel?> GetByIdAsync(int id) =>
        await db.Hotels.Include(h => h.RoomTypes).FirstOrDefaultAsync(h => h.Id == id);

    public async Task<Hotel> CreateAsync(Hotel hotel)
    {
        db.Hotels.Add(hotel);
        await db.SaveChangesAsync();
        return hotel;
    }

    public async Task<Hotel?> UpdateAsync(int id, Hotel updated)
    {
        var hotel = await db.Hotels.FindAsync(id);
        if (hotel is null) return null;

        hotel.Name = updated.Name;
        hotel.Stars = updated.Stars;
        hotel.Address = updated.Address;
        hotel.City = updated.City;
        hotel.Country = updated.Country;
        hotel.Phone = updated.Phone;
        hotel.Email = updated.Email;
        hotel.Description = updated.Description;
        hotel.IsActive = updated.IsActive;

        await db.SaveChangesAsync();
        return hotel;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var hotel = await db.Hotels.FindAsync(id);
        if (hotel is null) return false;
        db.Hotels.Remove(hotel);
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsAsync(int id) => await db.Hotels.AnyAsync(h => h.Id == id);
}
