using Altairis.API.DTOs.Availability;

namespace Altairis.API.Services;

public interface IAvailabilityService
{
    Task<IEnumerable<AvailabilityDto>> GetAsync(AvailabilityQueryParams queryParams);
    Task<AvailabilityDto> CreateAsync(CreateAvailabilityDto dto);
    Task<AvailabilityDto?> UpdateAsync(int id, UpdateAvailabilityDto dto);
    Task BulkUpsertAsync(BulkAvailabilityDto dto);
}
