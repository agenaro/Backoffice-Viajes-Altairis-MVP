using Altairis.API.DTOs.Availability;
using Altairis.API.Models;
using Altairis.API.Repositories;

namespace Altairis.API.Services;

public class AvailabilityService(IAvailabilityRepository repo, IRoomTypeRepository roomTypeRepo) : IAvailabilityService
{
    public async Task<IEnumerable<AvailabilityDto>> GetAsync(AvailabilityQueryParams queryParams)
    {
        var items = await repo.GetAsync(queryParams);
        return items.Select(ToDto);
    }

    public async Task<AvailabilityDto> CreateAsync(CreateAvailabilityDto dto)
    {
        var av = new Availability
        {
            RoomTypeId = dto.RoomTypeId,
            Date = dto.Date.Date,
            AvailableRooms = dto.AvailableRooms,
            Price = dto.Price
        };
        var created = await repo.CreateAsync(av);
        var full = await repo.GetByIdAsync(created.Id);
        return ToDto(full!);
    }

    public async Task<AvailabilityDto?> UpdateAsync(int id, UpdateAvailabilityDto dto)
    {
        var av = new Availability { AvailableRooms = dto.AvailableRooms, Price = dto.Price };
        var updated = await repo.UpdateAsync(id, av);
        if (updated is null) return null;
        var full = await repo.GetByIdAsync(updated.Id);
        return ToDto(full!);
    }

    public async Task BulkUpsertAsync(BulkAvailabilityDto dto)
    {
        var rt = await roomTypeRepo.GetByIdAsync(dto.RoomTypeId) ?? throw new KeyNotFoundException("RoomType not found");
        var availabilities = new List<Availability>();
        for (var d = dto.StartDate.Date; d <= dto.EndDate.Date; d = d.AddDays(1))
        {
            availabilities.Add(new Availability
            {
                RoomTypeId = dto.RoomTypeId,
                Date = d,
                AvailableRooms = dto.AvailableRooms,
                Price = dto.Price
            });
        }
        await repo.BulkUpsertAsync(availabilities);
    }

    private static AvailabilityDto ToDto(Availability a) => new()
    {
        Id = a.Id,
        RoomTypeId = a.RoomTypeId,
        RoomTypeName = a.RoomType?.Name ?? string.Empty,
        HotelId = a.RoomType?.HotelId ?? 0,
        HotelName = a.RoomType?.Hotel?.Name ?? string.Empty,
        Date = a.Date,
        AvailableRooms = a.AvailableRooms,
        TotalRooms = a.RoomType?.TotalRooms ?? 0,
        Price = a.Price
    };
}
