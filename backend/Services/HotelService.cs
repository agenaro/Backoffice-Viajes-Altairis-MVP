using Altairis.API.DTOs.Common;
using Altairis.API.DTOs.Hotel;
using Altairis.API.Models;
using Altairis.API.Repositories;

namespace Altairis.API.Services;

public class HotelService(IHotelRepository repo) : IHotelService
{
    public async Task<PagedResult<HotelDto>> GetAllAsync(HotelQueryParams queryParams)
    {
        var result = await repo.GetAllAsync(queryParams);
        return new PagedResult<HotelDto>
        {
            Items = result.Items.Select(ToDto),
            TotalCount = result.TotalCount,
            Page = result.Page,
            PageSize = result.PageSize
        };
    }

    public async Task<HotelDto?> GetByIdAsync(int id)
    {
        var hotel = await repo.GetByIdAsync(id);
        return hotel is null ? null : ToDto(hotel);
    }

    public async Task<HotelDto> CreateAsync(CreateHotelDto dto)
    {
        var hotel = new Hotel
        {
            Name = dto.Name, Stars = dto.Stars, Address = dto.Address,
            City = dto.City, Country = dto.Country, Phone = dto.Phone,
            Email = dto.Email, Description = dto.Description
        };
        var created = await repo.CreateAsync(hotel);
        return ToDto(created);
    }

    public async Task<HotelDto?> UpdateAsync(int id, UpdateHotelDto dto)
    {
        var hotel = new Hotel
        {
            Name = dto.Name, Stars = dto.Stars, Address = dto.Address,
            City = dto.City, Country = dto.Country, Phone = dto.Phone,
            Email = dto.Email, Description = dto.Description, IsActive = dto.IsActive
        };
        var updated = await repo.UpdateAsync(id, hotel);
        return updated is null ? null : ToDto(updated);
    }

    public Task<bool> DeleteAsync(int id) => repo.DeleteAsync(id);

    private static HotelDto ToDto(Hotel h) => new()
    {
        Id = h.Id, Name = h.Name, Stars = h.Stars, Address = h.Address,
        City = h.City, Country = h.Country, Phone = h.Phone, Email = h.Email,
        Description = h.Description, IsActive = h.IsActive, CreatedAt = h.CreatedAt,
        RoomTypesCount = h.RoomTypes?.Count ?? 0
    };
}
