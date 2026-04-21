using Altairis.API.DTOs.RoomType;

namespace Altairis.API.Services;

public interface IRoomTypeService
{
    Task<IEnumerable<RoomTypeDto>> GetByHotelIdAsync(int hotelId);
    Task<RoomTypeDto?> GetByIdAsync(int id);
    Task<RoomTypeDto> CreateAsync(CreateRoomTypeDto dto);
    Task<RoomTypeDto?> UpdateAsync(int id, UpdateRoomTypeDto dto);
    Task<bool> DeleteAsync(int id);
}
