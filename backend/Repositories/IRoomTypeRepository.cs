using Altairis.API.Models;

namespace Altairis.API.Repositories;

public interface IRoomTypeRepository
{
    Task<IEnumerable<RoomType>> GetByHotelIdAsync(int hotelId);
    Task<RoomType?> GetByIdAsync(int id);
    Task<RoomType> CreateAsync(RoomType roomType);
    Task<RoomType?> UpdateAsync(int id, RoomType roomType);
    Task<bool> DeleteAsync(int id);
}
