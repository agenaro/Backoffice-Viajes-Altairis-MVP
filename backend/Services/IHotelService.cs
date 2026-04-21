using Altairis.API.DTOs.Common;
using Altairis.API.DTOs.Hotel;

namespace Altairis.API.Services;

public interface IHotelService
{
    Task<PagedResult<HotelDto>> GetAllAsync(HotelQueryParams queryParams);
    Task<HotelDto?> GetByIdAsync(int id);
    Task<HotelDto> CreateAsync(CreateHotelDto dto);
    Task<HotelDto?> UpdateAsync(int id, UpdateHotelDto dto);
    Task<bool> DeleteAsync(int id);
}
