using Altairis.API.DTOs.RoomType;
using Altairis.API.Models;
using Altairis.API.Repositories;

namespace Altairis.API.Services;

public class RoomTypeService(IRoomTypeRepository repo) : IRoomTypeService
{
    public async Task<IEnumerable<RoomTypeDto>> GetByHotelIdAsync(int hotelId)
    {
        var rts = await repo.GetByHotelIdAsync(hotelId);
        return rts.Select(ToDto);
    }

    public async Task<RoomTypeDto?> GetByIdAsync(int id)
    {
        var rt = await repo.GetByIdAsync(id);
        return rt is null ? null : ToDto(rt);
    }

    public async Task<RoomTypeDto> CreateAsync(CreateRoomTypeDto dto)
    {
        var rt = new RoomType
        {
            HotelId = dto.HotelId, Name = dto.Name, Description = dto.Description,
            MaxOccupancy = dto.MaxOccupancy, BasePrice = dto.BasePrice, TotalRooms = dto.TotalRooms
        };
        var created = await repo.CreateAsync(rt);
        var full = await repo.GetByIdAsync(created.Id);
        return ToDto(full!);
    }

    public async Task<RoomTypeDto?> UpdateAsync(int id, UpdateRoomTypeDto dto)
    {
        var rt = new RoomType
        {
            Name = dto.Name, Description = dto.Description,
            MaxOccupancy = dto.MaxOccupancy, BasePrice = dto.BasePrice, TotalRooms = dto.TotalRooms
        };
        var updated = await repo.UpdateAsync(id, rt);
        if (updated is null) return null;
        var full = await repo.GetByIdAsync(updated.Id);
        return ToDto(full!);
    }

    public Task<bool> DeleteAsync(int id) => repo.DeleteAsync(id);

    private static RoomTypeDto ToDto(RoomType r) => new()
    {
        Id = r.Id, HotelId = r.HotelId, HotelName = r.Hotel?.Name ?? string.Empty,
        Name = r.Name, Description = r.Description, MaxOccupancy = r.MaxOccupancy,
        BasePrice = r.BasePrice, TotalRooms = r.TotalRooms
    };
}
