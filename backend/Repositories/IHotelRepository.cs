using Altairis.API.DTOs.Common;
using Altairis.API.DTOs.Hotel;
using Altairis.API.Models;

namespace Altairis.API.Repositories;

public interface IHotelRepository
{
    Task<PagedResult<Hotel>> GetAllAsync(HotelQueryParams queryParams);
    Task<Hotel?> GetByIdAsync(int id);
    Task<Hotel> CreateAsync(Hotel hotel);
    Task<Hotel?> UpdateAsync(int id, Hotel hotel);
    Task<bool> DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
}
